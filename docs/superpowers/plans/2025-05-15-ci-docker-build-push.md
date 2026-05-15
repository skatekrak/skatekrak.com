# CI Docker Build & Push Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Docker images for api, web, and manager in GitHub Actions, push them to a self-hosted registry, then trigger Dokploy to deploy the pre-built images.

**Architecture:** The single workflow file gains 3 build jobs (one per app) between the existing CI job and deploy jobs. Each build job uses fnox to decrypt registry credentials and build args, then uses `docker/build-push-action` to build and push. Deploy jobs remain webhook triggers to Dokploy.

**Tech Stack:** GitHub Actions, Docker Buildx, fnox (age encryption), self-hosted Docker registry

---

## File Map

- **Modify:** `.github/workflows/deploy.yml` — add build-api, build-web, build-manager jobs; update deploy jobs to depend on build jobs
- **No changes** to Dockerfiles, docker-compose.yml, turbo.json, or app code

## Prerequisites (Manual — User)

Before this workflow can run, the user must:

1. Add `FNOX_AGE_KEY` as a GitHub Actions secret
2. Add registry credentials to each app's `fnox.toml` (profile `ci` or default):
   - `apps/api/fnox.toml` — `REGISTRY_URL`, `REGISTRY_USERNAME`, `REGISTRY_PASSWORD`
   - `apps/web/fnox.toml` — `REGISTRY_URL`, `REGISTRY_USERNAME`, `REGISTRY_PASSWORD` (build args already exist)
   - `apps/manager/fnox.toml` — `REGISTRY_URL`, `REGISTRY_USERNAME`, `REGISTRY_PASSWORD` (build args already exist)
3. Reconfigure each app in Dokploy to pull from the registry instead of building from source

---

### Task 1: Rewrite the GitHub Actions workflow

**Files:**
- Modify: `.github/workflows/deploy.yml`

- [ ] **Step 1: Replace the entire workflow file**

Replace `.github/workflows/deploy.yml` with the following content. Key changes from the current file:
- CI job: unchanged (same lint/format/build steps with placeholder env vars)
- 3 new build jobs (`build-api`, `build-web`, `build-manager`): each checks out the repo, installs fnox via `jdx/mise-action`, decrypts secrets, logs into the registry, builds the Docker image, and pushes it
- Deploy jobs: unchanged logic, but now `needs` both `ci` and the corresponding build job
- `FNOX_AGE_KEY` is set as a top-level env var from GitHub Actions secrets so all build jobs can use it

```yaml
name: Deploy

on:
    push:
        branches: [main]

env:
    NEXT_PUBLIC_BUGSNAG_KEY: ${{ secrets.NEXT_PUBLIC_BUGSNAG_KEY }}
    FNOX_AGE_KEY: ${{ secrets.FNOX_AGE_KEY }}

jobs:
    ci:
        runs-on: ubuntu-latest
        env:
            NEXT_PUBLIC_CARRELAGE_URL: http://placeholder
            NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: http://placeholder
            NEXT_PUBLIC_KRAK_API_URL: http://placeholder
            NEXT_PUBLIC_STAGE: http://placeholder
            NEXT_PUBLIC_MEILI_HOST: http://placeholder
            NEXT_PUBLIC_MEILI_API_KEY: http://placeholder
            NEXT_PUBLIC_IMGPROXY_URL: http://placeholder
            NEXT_PUBLIC_UMAMI_SCRIPT_URL: http://placeholder
            NEXT_PUBLIC_UMAMI_WEBSITE_ID: http://placeholder
            NEXT_PUBLIC_WEBSITE_URL: http://placeholder
            NEXT_PUBLIC_RSS_BACKEND_URL: http://placeholder
            NEXT_PUBLIC_KRAKMAG_URL: http://placeholder
        steps:
            - uses: actions/checkout@v6
            - uses: oven-sh/setup-bun@v2
              with:
                  bun-version: 1.3.10
            - run: bun install --frozen-lockfile
            - run: bun lint
            - run: bun run format:check
            - run: bun run build

    build-api:
        runs-on: ubuntu-latest
        needs: [ci]
        steps:
            - uses: actions/checkout@v6

            - name: Install mise & fnox
              uses: jdx/mise-action@v2
              with:
                  install_args: fnox

            - name: Set up Docker Buildx
              uses: docker/setup-buildx-action@v3

            - name: Export fnox secrets
              id: secrets
              working-directory: apps/api
              run: |
                  eval "$(fnox export --format env)"
                  echo "REGISTRY_URL=$REGISTRY_URL" >> $GITHUB_OUTPUT
                  echo "::add-mask::$REGISTRY_USERNAME"
                  echo "::add-mask::$REGISTRY_PASSWORD"
                  echo "REGISTRY_USERNAME=$REGISTRY_USERNAME" >> $GITHUB_OUTPUT
                  echo "REGISTRY_PASSWORD=$REGISTRY_PASSWORD" >> $GITHUB_OUTPUT

            - name: Login to registry
              uses: docker/login-action@v3
              with:
                  registry: ${{ steps.secrets.outputs.REGISTRY_URL }}
                  username: ${{ steps.secrets.outputs.REGISTRY_USERNAME }}
                  password: ${{ steps.secrets.outputs.REGISTRY_PASSWORD }}

            - name: Build and push API image
              uses: docker/build-push-action@v6
              with:
                  context: .
                  file: apps/api/Dockerfile
                  push: true
                  tags: |
                      ${{ steps.secrets.outputs.REGISTRY_URL }}/krak-api:latest
                      ${{ steps.secrets.outputs.REGISTRY_URL }}/krak-api:${{ github.sha }}
                  cache-from: type=gha
                  cache-to: type=gha,mode=max

    build-web:
        runs-on: ubuntu-latest
        needs: [ci]
        steps:
            - uses: actions/checkout@v6

            - name: Install mise & fnox
              uses: jdx/mise-action@v2
              with:
                  install_args: fnox

            - name: Set up Docker Buildx
              uses: docker/setup-buildx-action@v3

            - name: Export fnox secrets
              id: secrets
              working-directory: apps/web
              run: |
                  eval "$(fnox export --format env)"
                  echo "REGISTRY_URL=$REGISTRY_URL" >> $GITHUB_OUTPUT
                  echo "::add-mask::$REGISTRY_USERNAME"
                  echo "::add-mask::$REGISTRY_PASSWORD"
                  echo "REGISTRY_USERNAME=$REGISTRY_USERNAME" >> $GITHUB_OUTPUT
                  echo "REGISTRY_PASSWORD=$REGISTRY_PASSWORD" >> $GITHUB_OUTPUT
                  echo "NEXT_PUBLIC_CARRELAGE_URL=$NEXT_PUBLIC_CARRELAGE_URL" >> $GITHUB_OUTPUT
                  echo "NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=$NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN" >> $GITHUB_OUTPUT
                  echo "NEXT_PUBLIC_KRAK_API_URL=$NEXT_PUBLIC_KRAK_API_URL" >> $GITHUB_OUTPUT
                  echo "NEXT_PUBLIC_STAGE=$NEXT_PUBLIC_STAGE" >> $GITHUB_OUTPUT
                  echo "NEXT_PUBLIC_MEILI_HOST=$NEXT_PUBLIC_MEILI_HOST" >> $GITHUB_OUTPUT
                  echo "NEXT_PUBLIC_MEILI_API_KEY=$NEXT_PUBLIC_MEILI_API_KEY" >> $GITHUB_OUTPUT
                  echo "NEXT_PUBLIC_IMGPROXY_URL=$NEXT_PUBLIC_IMGPROXY_URL" >> $GITHUB_OUTPUT

            - name: Login to registry
              uses: docker/login-action@v3
              with:
                  registry: ${{ steps.secrets.outputs.REGISTRY_URL }}
                  username: ${{ steps.secrets.outputs.REGISTRY_USERNAME }}
                  password: ${{ steps.secrets.outputs.REGISTRY_PASSWORD }}

            - name: Build and push Web image
              uses: docker/build-push-action@v6
              with:
                  context: .
                  file: apps/web/Dockerfile
                  push: true
                  tags: |
                      ${{ steps.secrets.outputs.REGISTRY_URL }}/krak-web:latest
                      ${{ steps.secrets.outputs.REGISTRY_URL }}/krak-web:${{ github.sha }}
                  build-args: |
                      NEXT_PUBLIC_CARRELAGE_URL=${{ steps.secrets.outputs.NEXT_PUBLIC_CARRELAGE_URL }}
                      NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=${{ steps.secrets.outputs.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN }}
                      NEXT_PUBLIC_KRAK_API_URL=${{ steps.secrets.outputs.NEXT_PUBLIC_KRAK_API_URL }}
                      NEXT_PUBLIC_STAGE=${{ steps.secrets.outputs.NEXT_PUBLIC_STAGE }}
                      NEXT_PUBLIC_MEILI_HOST=${{ steps.secrets.outputs.NEXT_PUBLIC_MEILI_HOST }}
                      NEXT_PUBLIC_MEILI_API_KEY=${{ steps.secrets.outputs.NEXT_PUBLIC_MEILI_API_KEY }}
                      NEXT_PUBLIC_IMGPROXY_URL=${{ steps.secrets.outputs.NEXT_PUBLIC_IMGPROXY_URL }}
                  cache-from: type=gha
                  cache-to: type=gha,mode=max

    build-manager:
        runs-on: ubuntu-latest
        needs: [ci]
        steps:
            - uses: actions/checkout@v6

            - name: Install mise & fnox
              uses: jdx/mise-action@v2
              with:
                  install_args: fnox

            - name: Set up Docker Buildx
              uses: docker/setup-buildx-action@v3

            - name: Export fnox secrets
              id: secrets
              working-directory: apps/manager
              run: |
                  eval "$(fnox export --format env)"
                  echo "REGISTRY_URL=$REGISTRY_URL" >> $GITHUB_OUTPUT
                  echo "::add-mask::$REGISTRY_USERNAME"
                  echo "::add-mask::$REGISTRY_PASSWORD"
                  echo "REGISTRY_USERNAME=$REGISTRY_USERNAME" >> $GITHUB_OUTPUT
                  echo "REGISTRY_PASSWORD=$REGISTRY_PASSWORD" >> $GITHUB_OUTPUT
                  echo "NEXT_PUBLIC_KRAK_API_URL=$NEXT_PUBLIC_KRAK_API_URL" >> $GITHUB_OUTPUT
                  echo "NEXT_PUBLIC_IMGPROXY_URL=$NEXT_PUBLIC_IMGPROXY_URL" >> $GITHUB_OUTPUT

            - name: Login to registry
              uses: docker/login-action@v3
              with:
                  registry: ${{ steps.secrets.outputs.REGISTRY_URL }}
                  username: ${{ steps.secrets.outputs.REGISTRY_USERNAME }}
                  password: ${{ steps.secrets.outputs.REGISTRY_PASSWORD }}

            - name: Build and push Manager image
              uses: docker/build-push-action@v6
              with:
                  context: .
                  file: apps/manager/Dockerfile
                  push: true
                  tags: |
                      ${{ steps.secrets.outputs.REGISTRY_URL }}/krak-manager:latest
                      ${{ steps.secrets.outputs.REGISTRY_URL }}/krak-manager:${{ github.sha }}
                  build-args: |
                      NEXT_PUBLIC_KRAK_API_URL=${{ steps.secrets.outputs.NEXT_PUBLIC_KRAK_API_URL }}
                      NEXT_PUBLIC_IMGPROXY_URL=${{ steps.secrets.outputs.NEXT_PUBLIC_IMGPROXY_URL }}
                  cache-from: type=gha
                  cache-to: type=gha,mode=max

    deploy-api:
        runs-on: ubuntu-latest
        needs: [build-api]
        steps:
            - name: Trigger Dokploy deployment for API
              run: |
                  curl --fail-with-body -X POST -H "x-api-key: ${{ secrets.DOKPLOY_TOKEN }}" -H "Content-Type: application/json" -H "Accept: application/json" "${{ secrets.DOKPLOY_DEPLOY_URL }}" -d '{"applicationId": "${{ secrets.DOKPLOY_API_ID }}"}'

    deploy-web:
        runs-on: ubuntu-latest
        needs: [build-web]
        steps:
            - name: Trigger Dokploy deployment for Web
              run: |
                  curl --fail-with-body -X POST -H "x-api-key: ${{ secrets.DOKPLOY_TOKEN }}" -H "Content-Type: application/json" -H "Accept: application/json" "${{ secrets.DOKPLOY_DEPLOY_URL }}" -d '{"applicationId": "${{ secrets.DOKPLOY_WEB_ID }}"}'

    deploy-manager:
        runs-on: ubuntu-latest
        needs: [build-manager]
        steps:
            - name: Trigger Dokploy deployment for Manager
              run: |
                  curl --fail-with-body -X POST -H "x-api-key: ${{ secrets.DOKPLOY_TOKEN }}" -H "Content-Type: application/json" -H "Accept: application/json" "${{ secrets.DOKPLOY_DEPLOY_URL }}" -d '{"applicationId": "${{ secrets.DOKPLOY_MANAGER_ID }}"}'
```

- [ ] **Step 2: Verify YAML syntax**

Run: `python3 -c "import yaml; yaml.safe_load(open('.github/workflows/deploy.yml'))"`
Expected: No output (valid YAML)

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: build Docker images in GitHub Actions and push to self-hosted registry"
```

---

### Task 2: Add fnox registry secrets (Manual — User)

This task is performed by the user, not by the agent. Documenting here for completeness.

- [ ] **Step 1: Add FNOX_AGE_KEY to GitHub Actions secrets**

Go to GitHub repo → Settings → Secrets and variables → Actions → New repository secret.
Name: `FNOX_AGE_KEY`
Value: contents of `~/.config/fnox/age.txt` (the line starting with `AGE-SECRET-KEY-...`)

- [ ] **Step 2: Add registry credentials to each app's fnox.toml**

```bash
cd apps/api && fnox set REGISTRY_URL "your-registry-url" && fnox set REGISTRY_USERNAME "your-username" && fnox set REGISTRY_PASSWORD "your-password"
cd apps/web && fnox set REGISTRY_URL "your-registry-url" && fnox set REGISTRY_USERNAME "your-username" && fnox set REGISTRY_PASSWORD "your-password"
cd apps/manager && fnox set REGISTRY_URL "your-registry-url" && fnox set REGISTRY_USERNAME "your-username" && fnox set REGISTRY_PASSWORD "your-password"
```

- [ ] **Step 3: Commit the updated fnox.toml files**

```bash
git add apps/api/fnox.toml apps/web/fnox.toml apps/manager/fnox.toml
git commit -m "chore: add registry credentials to fnox"
```

- [ ] **Step 4: Reconfigure Dokploy**

For each app in the Dokploy dashboard, change the deployment source from "build from git" to "pull from registry" using the image name `<registry-url>/krak-<app>:latest`.
