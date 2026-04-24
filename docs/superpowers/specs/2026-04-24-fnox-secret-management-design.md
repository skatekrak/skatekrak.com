# fnox Secret Management via mise

**Date:** 2026-04-24
**Status:** Draft
**Scope:** Replace `.env` files with fnox (age-encrypted) across all three apps

## Goal

Replace plain-text `.env` files with fnox-managed, age-encrypted secrets committed to git. Secrets are decrypted at runtime via `fnox exec` wrapping each app's dev command. Team members are added as age recipients so everyone can decrypt.

## Current State

- **mise** is already installed and configured (`.mise.toml` manages bun, node, lefthook, caddy)
- Three `.env` files exist: `apps/api/.env` (30 lines, real secrets), `apps/web/.env` (13 lines), `apps/manager/.env` (3 lines, public URLs only)
- `apps/api/.env` contains committed secrets (API keys, DB credentials, S3 keys) — these need rotation post-migration
- `apps/web/.env.example` exists but is empty
- No env validation in `apps/web` — `process.env` accessed directly
- The api seed script uses `bun --env-file=.env` explicitly

## Design

### Tool Installation

Add `fnox` to the root `.mise.toml` tools section:

```toml
[tools]
bun = "1.3.10"
node = "24"
lefthook = "latest"
fnox = "latest"
"aqua:caddyserver/caddy" = "latest"
```

### Config Structure — One fnox.toml Per App

Each app gets its own `fnox.toml` with age encryption. All env vars (secrets and config alike) go into fnox for consistency — no more `.env` files.

```
apps/api/fnox.toml      # 21 vars (DB creds, API keys, S3, auth, mail, etc.)
apps/web/fnox.toml      # 13 vars (mapbox, meili, discord, public URLs)
apps/manager/fnox.toml  # 3 vars (API URLs, imgproxy URL)
```

### Age Key Setup

Each team member needs an age identity:

```bash
fnox keygen  # generates ~/.config/fnox/age-key.txt (private) and prints public key
```

All public keys are listed as recipients in each `fnox.toml`. When a new team member joins, their public key is added and secrets are re-encrypted with `fnox rekey`.

### fnox.toml Format (per app)

Example for `apps/api/fnox.toml`:

```toml
[providers]
age = { type = "age", recipients = [
    "age1abc...",  # Maxime
    "age1def...",  # Team member 2
]}

[secrets]
PORT = { provider = "age", value = "<encrypted>" }
DATABASE_URL = { provider = "age", value = "<encrypted>" }
BETTER_AUTH_SECRET = { provider = "age", value = "<encrypted>" }
# ... all 21 vars
```

Secrets are set via `fnox set KEY "value"` from within the app directory. fnox encrypts for all recipients automatically.

### Dev Workflow Integration

**Current dev scripts** (in each app's `package.json`):

```json
// apps/api
"dev": "bun --watch run src/index.ts"

// apps/web
"dev": "next dev"

// apps/manager
"dev": "next dev --port 3002"
```

**New dev scripts** — wrap with `fnox exec`:

```json
// apps/api
"dev": "fnox exec -- bun --watch run src/index.ts"

// apps/web
"dev": "fnox exec -- next dev"

// apps/manager
"dev": "fnox exec -- next dev --port 3002"
```

`fnox exec` reads the local `fnox.toml`, decrypts all secrets, injects them as environment variables, and runs the command. This works transparently with turbo — each app's `dev` script is called by turbo and fnox handles the rest.

**Other scripts that need updating:**

- `apps/api` `seed:meilisearch`: currently uses `bun --env-file=.env`. Change to `fnox exec -- bun run src/scripts/seed-meilisearch.ts`
- `apps/api` `start`: `fnox exec -- bun run dist/index.js` (for local start; production deploys use their own env injection)
- `apps/web` `build`: needs `NEXT_PUBLIC_*` vars at build time. Change to `fnox exec -- next build` (remove hardcoded `NEXT_PUBLIC_STAGE=production` from the script — that should come from fnox or a CI env)

### Build Scripts

Build scripts (`build` in each `package.json`) are **not wrapped** with `fnox exec`. Production builds happen in Vercel/Dokploy which inject their own env vars. fnox is local-dev only.

The web build script currently hardcodes `NEXT_PUBLIC_STAGE=production`:

```json
"build": "NEXT_PUBLIC_STAGE=production NODE_ENV=production next build"
```

This stays unchanged — it's only used for production builds in CI/deploy.

### Mise Task Changes

The root `.mise.toml` dev task stays the same — it calls `turbo dev --parallel`, which calls each app's `dev` script. Since fnox exec is in each app's package.json dev script, no mise task changes are needed beyond adding fnox to `[tools]`.

Add a convenience setup task for new team members:

```toml
[tasks."setup:fnox"]
description = "Generate age key and display public key for team sharing"
run = """
#!/usr/bin/env bash
set -e
if [ ! -f ~/.config/fnox/age-key.txt ]; then
    fnox keygen
    echo ""
    echo "Share the public key above with the team to be added as a recipient."
else
    echo "Age key already exists at ~/.config/fnox/age-key.txt"
    echo "Public key:"
    grep "public key:" ~/.config/fnox/age-key.txt | awk '{print $NF}' || age-keygen -y ~/.config/fnox/age-key.txt
fi
"""
```

### Files to Remove

- `apps/api/.env` — replaced by `apps/api/fnox.toml`
- `apps/web/.env` — replaced by `apps/web/fnox.toml`
- `apps/manager/.env` — replaced by `apps/manager/fnox.toml`
- `apps/web/.env.example` — empty, useless

### .gitignore Changes

Current `.gitignore` has:
```
/.env*
.env
```

Add fnox-specific entries. The `fnox.toml` files **should be committed** (they contain encrypted secrets, that's the point). No `.gitignore` changes needed for fnox itself.

Keep the existing `.env` and `/.env*` patterns — they'll prevent accidental `.env` file creation in the future.

### Onboarding Flow (New Team Member)

1. Clone the repo
2. `mise install` (installs bun, node, fnox, etc.)
3. `mise run setup:fnox` (generates age key, prints public key)
4. Share public key with existing team member
5. Existing member adds public key to all `fnox.toml` files and re-encrypts: `fnox rekey`
6. Pull the updated `fnox.toml` files
7. `mise run dev` — everything works

### Security Considerations

- **Rotate all secrets** in `apps/api/.env` after migration — they've been committed in plain text to git history
- `fnox.toml` files are safe to commit — secrets are age-encrypted
- Private age keys (`~/.config/fnox/age-key.txt`) must never be committed
- The `.gitignore` already covers `.env` files, preventing accidental plain-text leaks

### Out of Scope

- Production/staging secret management (stays in Vercel/Dokploy env vars)
- Env validation for `apps/web` (separate concern)
- Secret rotation (manual process, documented but not automated)
- CI secret management (GitHub Actions uses its own secrets)
