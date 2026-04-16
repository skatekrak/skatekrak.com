# Skatekrak

Monorepo for the Skatekrak skateboarding platform.

| App / Package | Path | What it does |
| --- | --- | --- |
| **Web** | `apps/web` | Main website (Next.js, React 19, Tailwind) |
| **API** | `apps/api` | Backend API (Elysia on Bun, oRPC, Prisma) |
| **Manager** | `apps/manager` | Admin dashboard (Next.js) |
| **Contracts** | `packages/contracts` | Shared oRPC contract definitions |
| **Auth** | `packages/auth` | Shared authentication logic |
| **Prisma** | `packages/prisma` | Database schema and client |
| **Types** | `packages/types` | Shared TypeScript types |
| **UI** | `packages/ui` | Shared component library |

## Prerequisites

- [mise](https://mise.jdx.dev) -- manages Bun, Node and Caddy for you
- [Docker](https://docs.docker.com/get-docker/) -- runs Postgres and Meilisearch locally

That's it. mise handles the rest.

## Getting started

### 1. Install mise

```sh
# macOS
brew install mise

# or with the install script
curl https://mise.run | sh
```

Then activate it in your shell ([instructions](https://mise.jdx.dev/getting-started.html)).

### 2. Clone and install

```sh
git clone git@github.com:skatekrak/skatekrak.git
cd skatekrak

# mise reads .mise.toml and installs the right versions of Bun, Node and Caddy
mise install

# Install dependencies
bun install
```

### 3. One-time setup

This adds local domain entries to `/etc/hosts` and trusts the Caddy CA for HTTPS:

```sh
mise run setup
```

You will be prompted for your password (needed for `/etc/hosts` and trusting the certificate).

After this, the following local domains are available:

| Domain | Routes to |
| --- | --- |
| `https://dev.skatekrak.com` | Web (port 3000) |
| `https://api.dev.skatekrak.com` | API (port 3001) |
| `https://manager.dev.skatekrak.com` | Manager (port 3002) |

### 4. Environment variables

Copy the example env files and fill in the required values:

```sh
cp apps/api/.env.example apps/api/.env    # API secrets
cp apps/web/.env.example apps/web/.env    # Web config
```

Ask a team member for the actual values.

## Development

### Start everything

```sh
# Start infra (Postgres, Meilisearch, Caddy) + all apps in parallel
mise run dev
```

Or step by step:

```sh
# Start only infra services
mise run dev:infra

# Then start all apps
bun run dev
```

### Start a single app

```sh
bun run dev:web        # Web on port 3000
bun run dev:api        # API on port 3001
bun run dev:manager    # Manager on port 3002
```

### Stop everything

```sh
mise run dev:stop
```

## Useful commands

```sh
bun run build          # Build all apps and packages
bun run lint           # Lint with oxlint + sherif
bun run format         # Format with oxfmt
bun run format:check   # Check formatting without writing
```

## Deployments

| Branch | Environment | URL |
| --- | --- | --- |
| `main` | Production | [skatekrak.com](https://www.skatekrak.com) |
| PRs | Preview | Auto-deployed on Vercel |
