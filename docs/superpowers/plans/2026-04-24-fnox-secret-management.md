# fnox Secret Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace plain-text `.env` files with fnox age-encrypted secrets managed via mise, across all three apps.

**Architecture:** fnox installed via mise, one `fnox.toml` per app with age encryption, `fnox exec` wrapping each app's dev/start scripts in `package.json`. Secrets are encrypted for all team recipients and committed to git.

**Tech Stack:** fnox, age encryption, mise

---

### Task 1: Install fnox via mise and generate age key

**Files:**
- Modify: `.mise.toml` (add fnox to tools)

- [ ] **Step 1: Add fnox to mise tools**

Edit `.mise.toml` to add fnox to the `[tools]` section:

```toml
[tools]
bun = "1.3.10"
node = "24"
lefthook = "latest"
fnox = "latest"
"aqua:caddyserver/caddy" = "latest"
```

- [ ] **Step 2: Install fnox via mise**

Run:
```bash
mise install
```

Expected: fnox binary is now available. Verify:
```bash
fnox --version
```
Expected: version string like `fnox 1.x.x`

- [ ] **Step 3: Generate your age key**

Run:
```bash
age-keygen -o ~/.config/fnox/age.txt
```

If `~/.config/fnox` doesn't exist, create it first:
```bash
mkdir -p ~/.config/fnox
age-keygen -o ~/.config/fnox/age.txt
```

Expected: output showing the public key:
```
Public key: age1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Save the public key — you'll need it for every `fnox.toml`.

- [ ] **Step 4: Set the FNOX_AGE_KEY environment variable**

Add to your `~/.zshrc` (or equivalent):
```bash
export FNOX_AGE_KEY=$(grep "AGE-SECRET-KEY" ~/.config/fnox/age.txt)
```

Then reload:
```bash
source ~/.zshrc
```

Verify:
```bash
echo $FNOX_AGE_KEY
```
Expected: starts with `AGE-SECRET-KEY-`

- [ ] **Step 5: Commit mise.toml change**

```bash
git add .mise.toml
git commit -m "chore: add fnox to mise tools"
```

---

### Task 2: Initialize fnox for apps/api and import secrets

**Files:**
- Create: `apps/api/fnox.toml` (via fnox CLI)
- Modify: `apps/api/package.json` (wrap scripts with `fnox exec`)

- [ ] **Step 1: Initialize fnox in apps/api**

Run from `apps/api`:
```bash
cd apps/api
fnox init
```

Expected: creates a `fnox.toml` file in `apps/api/`.

- [ ] **Step 2: Add age provider to apps/api/fnox.toml**

Run:
```bash
fnox provider add age --type age --recipients "YOUR_AGE_PUBLIC_KEY"
```

Replace `YOUR_AGE_PUBLIC_KEY` with the public key from Task 1 Step 3 (e.g., `age1xxxxxxxxx...`).

Verify the `fnox.toml` has the provider:
```bash
cat fnox.toml
```

Expected: `[providers]` section with age provider and your public key as recipient.

- [ ] **Step 3: Import existing .env secrets**

Run from `apps/api`:
```bash
fnox import -i .env --provider age
```

Expected: all 21 env vars from `.env` are imported and encrypted in `fnox.toml`.

Verify:
```bash
fnox list
```

Expected: lists all secrets — `PORT`, `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_BASE_URL`, `DISCORD_HOOK_URL`, `ADMIN_TOKEN`, `PLACE_API`, `MAILGUN_KEY`, `MAILGUN_DOMAIN`, `MAIL_FROM_NAME`, `MAIL_FROM_EMAIL`, `VIMEO_AUTH`, `GOOGLE_KEY`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_SECRET_KEY`, `MEILI_HOST`, `MEILI_ADMIN_KEY`, `S3_ENDPOINT`, `S3_REGION`, `S3_BUCKET`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`.

- [ ] **Step 4: Verify decryption works**

Run:
```bash
fnox get DATABASE_URL
```

Expected: `postgresql://krak:krak@localhost:5433/krak`

- [ ] **Step 5: Update apps/api/package.json dev script**

Edit `apps/api/package.json` — change the `scripts` section:

```json
"scripts": {
    "dev": "fnox exec -- bun --watch run src/index.ts",
    "start": "fnox exec -- bun run dist/index.js",
    "build": "bun build src/index.ts --target bun --outdir ./dist",
    "seed:meilisearch": "fnox exec -- bun run src/scripts/seed-meilisearch.ts"
}
```

Changes:
- `dev`: prepend `fnox exec --`
- `start`: prepend `fnox exec --`
- `build`: unchanged (production builds use CI/deploy env vars)
- `seed:meilisearch`: replace `bun --env-file=.env run` with `fnox exec -- bun run`

- [ ] **Step 6: Test the dev script**

Run from `apps/api`:
```bash
bun run dev
```

Expected: Elysia server starts on port 3001 with all env vars loaded. Check console output for any missing env var errors (the `@t3-oss/env-core` validation in `src/env.ts` will throw if anything is missing).

Press Ctrl+C to stop.

- [ ] **Step 7: Commit**

```bash
cd ../..
git add apps/api/fnox.toml apps/api/package.json
git commit -m "feat: add fnox secret management for api app"
```

---

### Task 3: Initialize fnox for apps/web and import secrets

**Files:**
- Create: `apps/web/fnox.toml` (via fnox CLI)
- Modify: `apps/web/package.json` (wrap dev script with `fnox exec`)

- [ ] **Step 1: Initialize fnox in apps/web**

Run from `apps/web`:
```bash
cd apps/web
fnox init
```

- [ ] **Step 2: Add age provider**

Run:
```bash
fnox provider add age --type age --recipients "YOUR_AGE_PUBLIC_KEY"
```

Use the same public key as Task 2.

- [ ] **Step 3: Import existing .env secrets**

Run from `apps/web`:
```bash
fnox import -i .env --provider age
```

Verify:
```bash
fnox list
```

Expected: 13 secrets listed — `NEXT_PUBLIC_CARRELAGE_URL`, `CARRELAGE_URL`, `DISCORD_HOOK_URL`, `ADMIN_TOKEN`, `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`, `NEXT_PUBLIC_KRAK_API_URL`, `NEXT_PUBLIC_STAGE`, `NEXT_PUBLIC_MEILI_HOST`, `NEXT_PUBLIC_MEILI_API_KEY`, `NEXT_PUBLIC_IMGPROXY_URL`, `NEXT_PUBLIC_UMAMI_SCRIPT_URL`, `NEXT_PUBLIC_UMAMI_WEBSITE_ID`.

- [ ] **Step 4: Verify decryption**

Run:
```bash
fnox get NEXT_PUBLIC_KRAK_API_URL
```

Expected: `https://api.dev.skatekrak.com`

- [ ] **Step 5: Update apps/web/package.json dev script**

Edit `apps/web/package.json` — change only the `dev` script:

```json
"scripts": {
    "dev": "fnox exec -- next dev",
    "start:cmd:debug": "NODE_OPTIONS='--inspect' next dev",
    "build": "NEXT_PUBLIC_STAGE=production NODE_ENV=production next build",
    "start": "next start",
    "analyze": "ANALYZE=true next build",
    "style": "oxlint --fix .",
    "lint": "oxlint ."
}
```

Changes:
- `dev`: prepend `fnox exec --`
- `build`, `start`, others: unchanged (production/CI scripts)

- [ ] **Step 6: Test the dev script**

Run from `apps/web`:
```bash
bun run dev
```

Expected: Next.js dev server starts on port 3000. Open `https://dev.skatekrak.com` (via Caddy) and verify the app loads.

Press Ctrl+C to stop.

- [ ] **Step 7: Commit**

```bash
cd ../..
git add apps/web/fnox.toml apps/web/package.json
git commit -m "feat: add fnox secret management for web app"
```

---

### Task 4: Initialize fnox for apps/manager and import secrets

**Files:**
- Create: `apps/manager/fnox.toml` (via fnox CLI)
- Modify: `apps/manager/package.json` (wrap dev script with `fnox exec`)

- [ ] **Step 1: Initialize fnox in apps/manager**

Run from `apps/manager`:
```bash
cd apps/manager
fnox init
```

- [ ] **Step 2: Add age provider**

Run:
```bash
fnox provider add age --type age --recipients "YOUR_AGE_PUBLIC_KEY"
```

Same public key as Tasks 2 and 3.

- [ ] **Step 3: Import existing .env secrets**

Run from `apps/manager`:
```bash
fnox import -i .env --provider age
```

Verify:
```bash
fnox list
```

Expected: 3 secrets — `KRAK_API_URL`, `NEXT_PUBLIC_KRAK_API_URL`, `NEXT_PUBLIC_IMGPROXY_URL`.

- [ ] **Step 4: Verify decryption**

Run:
```bash
fnox get KRAK_API_URL
```

Expected: `https://api.dev.skatekrak.com`

- [ ] **Step 5: Update apps/manager/package.json dev script**

Edit `apps/manager/package.json` — change only the `dev` script:

```json
"scripts": {
    "dev": "fnox exec -- next dev --port 3002",
    "build": "next build",
    "start": "next start"
}
```

Changes:
- `dev`: prepend `fnox exec --`
- `build`, `start`: unchanged

- [ ] **Step 6: Test the dev script**

Run from `apps/manager`:
```bash
bun run dev
```

Expected: Next.js dev server starts on port 3002. Open `https://manager.dev.skatekrak.com` and verify it loads.

Press Ctrl+C to stop.

- [ ] **Step 7: Commit**

```bash
cd ../..
git add apps/manager/fnox.toml apps/manager/package.json
git commit -m "feat: add fnox secret management for manager app"
```

---

### Task 5: Add mise setup task and clean up old .env files

**Files:**
- Modify: `.mise.toml` (add `setup:fnox` task)
- Delete: `apps/api/.env`
- Delete: `apps/web/.env`
- Delete: `apps/web/.env.example`
- Delete: `apps/manager/.env`

- [ ] **Step 1: Add setup:fnox task to .mise.toml**

Add the following task to `.mise.toml` after the existing `[tasks.dev]` section:

```toml
[tasks."setup:fnox"]
description = "Generate age key for fnox secret management"
run = """
#!/usr/bin/env bash
set -e
if [ -f ~/.config/fnox/age.txt ]; then
    echo "Age key already exists at ~/.config/fnox/age.txt"
    echo "Your public key:"
    grep "public key:" ~/.config/fnox/age.txt | awk '{print $NF}'
else
    mkdir -p ~/.config/fnox
    age-keygen -o ~/.config/fnox/age.txt
    echo ""
    echo "Key generated. Share the public key above with the team to be added as a recipient."
    echo ""
    echo "Add this to your ~/.zshrc:"
    echo '  export FNOX_AGE_KEY=$(grep "AGE-SECRET-KEY" ~/.config/fnox/age.txt)'
fi
"""
```

- [ ] **Step 2: Test the setup task**

Run:
```bash
mise run setup:fnox
```

Expected: since you already have a key, it should print "Age key already exists" and show your public key.

- [ ] **Step 3: Run full dev environment to verify everything works**

Start the infrastructure and all apps:
```bash
mise run dev
```

Expected: docker services start, Caddy starts, turbo launches all three apps in parallel. All apps start without env var errors.

Verify each app:
- `https://dev.skatekrak.com` — web app loads
- `https://api.dev.skatekrak.com` — API responds
- `https://manager.dev.skatekrak.com` — manager loads

Press Ctrl+C to stop.

- [ ] **Step 4: Delete old .env files**

```bash
rm apps/api/.env
rm apps/web/.env
rm apps/web/.env.example
rm apps/manager/.env
```

- [ ] **Step 5: Verify apps still work without .env files**

Run:
```bash
mise run dev
```

Expected: everything still works — fnox provides all env vars via `fnox exec`.

- [ ] **Step 6: Commit**

```bash
git add .mise.toml
git rm apps/api/.env apps/web/.env apps/web/.env.example apps/manager/.env 2>/dev/null || true
git add -u
git commit -m "chore: remove .env files, add fnox setup task

Secrets are now managed by fnox with age encryption.
Each app has a fnox.toml with encrypted secrets.
Run 'mise run setup:fnox' to generate your age key."
```

> **Post-migration note:** The old `apps/api/.env` contained plain-text secrets committed to git history. All sensitive credentials (BETTER_AUTH_SECRET, API keys, S3 keys, Cloudinary keys, Mailgun key, Discord webhook URLs) should be rotated in the respective services. This is a manual process outside this plan's scope.

---

### Task 6: Update AGENTS.md documentation

**Files:**
- Modify: `AGENTS.md` (update env and setup docs)

- [ ] **Step 1: Update the Build / Lint / Test section**

In `AGENTS.md`, after the existing `bun install` line in the commands section, the dev commands already reference `mise run dev`. No changes needed there.

Add fnox setup to the Prisma section or create a new section:

Find the Infrastructure section and add after the Docker Compose bullet points:

```markdown
- **Secrets:** managed by fnox with age encryption. Each app has a `fnox.toml`.
    - Run `mise run setup:fnox` to generate your age key (first-time only)
    - Add `export FNOX_AGE_KEY=$(grep "AGE-SECRET-KEY" ~/.config/fnox/age.txt)` to `~/.zshrc`
    - Secrets are decrypted at runtime by `fnox exec` in each app's `dev` script
```

- [ ] **Step 2: Update the Common Pitfalls section**

Add a new bullet to the Common Pitfalls section:

```markdown
- Environment variables are managed by **fnox** (age-encrypted in `fnox.toml`), not `.env` files. Never create `.env` files manually. Use `fnox set KEY "value"` from the app directory to add new secrets.
```

- [ ] **Step 3: Commit**

```bash
git add AGENTS.md
git commit -m "docs: update AGENTS.md with fnox secret management info"
```
