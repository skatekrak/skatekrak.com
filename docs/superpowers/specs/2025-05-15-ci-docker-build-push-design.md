# CI Docker Build & Push to Self-Hosted Registry

**Date:** 2025-05-15
**Status:** Approved

## Problem

The current GitHub Actions workflow triggers Dokploy webhooks after CI passes. Dokploy then pulls the repo, builds Docker images from each app's Dockerfile, and deploys them. This means:

- Build happens on the Dokploy server, consuming its resources
- No image history or tagging — hard to trace running containers to commits
- No layer caching across builds on the Dokploy side

## Solution

Build Docker images in GitHub Actions, push them to a self-hosted registry on the Dokploy server, then trigger Dokploy to pull and deploy the pre-built images.

## Architecture

### Job Graph

```
ci → [build-api, build-web, build-manager] → [deploy-api, deploy-web, deploy-manager]
```

- **ci** — unchanged (bun install, lint, format check, build)
- **build-\*** — builds Docker image and pushes to self-hosted registry
- **deploy-\*** — triggers Dokploy webhook (unchanged curl calls)

All build jobs run in parallel after CI. All deploy jobs run in parallel after their respective build job.

### Image Naming & Tagging

```
<registry-url>/krak-api:latest
<registry-url>/krak-api:<git-sha>

<registry-url>/krak-web:latest
<registry-url>/krak-web:<git-sha>

<registry-url>/krak-manager:latest
<registry-url>/krak-manager:<git-sha>
```

- `latest` — always points to the most recent main build. Dokploy pulls this tag.
- `<git-sha>` — immutable tag for rollbacks and traceability.

### Secrets Management

Secrets are managed by **fnox** (age-encrypted), not duplicated in GitHub Actions secrets.

**GitHub Actions secrets (minimal):**

| Secret | Purpose |
|--------|---------|
| `FNOX_AGE_KEY` | Age key to decrypt fnox secrets |
| `DOKPLOY_TOKEN` | Dokploy API auth (already exists) |
| `DOKPLOY_DEPLOY_URL` | Dokploy endpoint (already exists) |
| `DOKPLOY_API_ID` | Already exists |
| `DOKPLOY_WEB_ID` | Already exists |
| `DOKPLOY_MANAGER_ID` | Already exists |
| `NEXT_PUBLIC_BUGSNAG_KEY` | Already exists |

**fnox secrets (per-app `fnox.toml`):**

Each app's `fnox.toml` gets CI-related secrets added:

- `apps/api/fnox.toml` — registry credentials (`REGISTRY_URL`, `REGISTRY_USERNAME`, `REGISTRY_PASSWORD`)
- `apps/web/fnox.toml` — registry credentials + all `NEXT_PUBLIC_*` build args (CARRELAGE_URL, MAPBOX_ACCESS_TOKEN, KRAK_API_URL, STAGE, MEILI_HOST, MEILI_API_KEY, IMGPROXY_URL, UMAMI_SCRIPT_URL, UMAMI_WEBSITE_ID, WEBSITE_URL, RSS_BACKEND_URL, KRAKMAG_URL)
- `apps/manager/fnox.toml` — registry credentials + `NEXT_PUBLIC_KRAK_API_URL`, `NEXT_PUBLIC_IMGPROXY_URL`

The user will add the fnox profiles before the workflow is used.

### Build Job Steps (per app)

1. **Checkout** — `actions/checkout@v6`
2. **Install fnox** — install the fnox CLI in the runner
3. **Set up Docker Buildx** — `docker/setup-buildx-action` (enables layer caching)
4. **Decrypt secrets via fnox** — run `fnox exec` in the app directory to export env vars, using `FNOX_AGE_KEY` from GitHub Actions secrets
5. **Login to registry** — `docker/login-action` with registry URL, username, password from fnox
6. **Build and push** — `docker/build-push-action` with:
   - `context: .` (monorepo root — Dockerfiles reference workspace-level files)
   - `file: apps/<app>/Dockerfile`
   - `push: true`
   - `tags: $REGISTRY_URL/krak-<app>:latest, $REGISTRY_URL/krak-<app>:<sha>`
   - `cache-from: type=gha` / `cache-to: type=gha,mode=max` (GitHub Actions layer cache)
   - Build args passed from fnox-decrypted env vars (web: 12 args, manager: 2 args, api: none)

### Deploy Job Steps (per app)

Unchanged from current workflow — `curl` POST to Dokploy API with the app's application ID.

### Dockerfiles

No changes to any Dockerfile. They already accept `NEXT_PUBLIC_*` build args and produce standalone images.

## Manual Steps (Outside This Workflow)

1. **Add fnox secrets** — user adds registry credentials and `NEXT_PUBLIC_*` values to each app's `fnox.toml`
2. **Add `FNOX_AGE_KEY` to GitHub Actions secrets** — the age decryption key
3. **Reconfigure Dokploy** — each app in Dokploy must be reconfigured to pull from the self-hosted registry (image: `<registry-url>/krak-<app>:latest`) instead of building from source

## Files Changed

- `.github/workflows/deploy.yml` — rewrite build/deploy jobs to build images in CI and push to registry
- No changes to Dockerfiles, docker-compose.yml, turbo.json, or app code
