# AGENTS.md — Skatekrak Monorepo

## Project Overview

Bun + Turborepo monorepo for the Skatekrak skateboarding platform. Three apps and six shared packages.

| Package           | Path                 | Tech                                                        | Deploys To              |
| ----------------- | -------------------- | ----------------------------------------------------------- | ----------------------- |
| `@krak/web`       | `apps/web`           | Next.js 16 (Pages Router), React 19, Zustand, Redux Toolkit | Vercel                  |
| `@krak/api`       | `apps/api`           | Elysia (Bun), oRPC, PostgreSQL (Prisma 7), BetterAuth       | Dokploy (custom server) |
| `@krak/manager`   | `apps/manager`       | Next.js 16 (App Router), React 19, oRPC                     | Dokploy                 |
| `@krak/auth`      | `packages/auth`      | BetterAuth 1.2 wrapper                                      | —                       |
| `@krak/contracts` | `packages/contracts` | oRPC contract definitions (Zod schemas)                     | —                       |
| `@krak/prisma`    | `packages/prisma`    | Prisma 7 client + PostgreSQL schema                         | —                       |
| `@krak/ui`        | `packages/ui`        | Shared React components (Radix UI + Tailwind CSS 4)         | —                       |
| `@krak/types`     | `packages/types`     | Shared TypeScript types                                     | —                       |
| `@krak/utils`     | `packages/utils`     | Shared utility functions                                    | —                       |

Dependency chain: `web` → `contracts` → `types`; `api` → `contracts` → `prisma` → `auth`; `manager` → `contracts` → `ui`.

> `packages/trpc` is an empty package left over from the MongoDB-era architecture — it contains no implementation and is unused.

## Build / Lint / Test Commands

Package manager is **Bun** (`bun@1.3.10`). Node engine: 24. Always use `bun` instead of npm/yarn/pnpm.

```bash
# Install dependencies
bun install

# Full monorepo
bun run build          # turbo build (all apps/packages)
bun run lint           # oxlint . && bunx sherif
bun run lint:fix       # oxlint . --fix && bunx sherif --fix
bun run format         # oxfmt .
bun run format:check   # oxfmt --check .
bun run dev            # turbo dev --parallel --ui tui (all apps)

# Individual apps
bun run dev:web        # Next.js dev server (port 3000)
bun run dev:api        # Elysia dev with --watch (port 3001)
bun run dev:manager    # Next.js manager dev server (port 3002)

# Build individual apps
bun run build:web      # turbo build --filter=@krak/web
bun run build:api      # turbo build --filter=@krak/api
bun run build:manager  # turbo build --filter=@krak/manager
bun run start:api      # cd apps/api && bun run start

# Prisma (run inside packages/prisma)
cd packages/prisma && bun run db:migrate   # prisma migrate dev
cd packages/prisma && bun run db:generate  # prisma generate
cd packages/prisma && bun run db:studio    # prisma studio
```

There are no unit or integration tests configured in the monorepo. Verification is done via TypeScript compilation and linting.

## Formatting

Configured with **oxfmt** at the repo root. Run `bun run format` to auto-format, `bun run format:check` in CI.

Standard settings (see `.prettierrc` still present but oxfmt is the active tool):

- 4 spaces indentation
- Single quotes
- 120-character print width
- Trailing commas

VSCode is configured to format on save (`.vscode/settings.json`).

## Code Style Guidelines

### Imports

Order imports as: external packages, then internal workspace packages (`@krak/*`), then relative imports. Separate groups with a blank line.

```ts
import { z } from 'zod';

import { type Spot, Status } from '@krak/types';
import { contract } from '@krak/contracts';

import { mapStore } from '../store/map';
```

Use `import type { ... }` for type-only imports. Enforced by TypeScript's `isolatedModules`.

### Naming Conventions

- **Variables / functions**: `camelCase` — `spotOverview`, `toggleFilter`, `createContext`
- **Types / Interfaces / Enums**: `PascalCase` — `SpotOverview`, `MapStore`, `Status`
- **React components**: `PascalCase` — `SpotCard`, `MapLayout`
- **Files**: `camelCase` for utilities/stores (`map.ts`, `spots.ts`), `PascalCase` for React components (`SpotCard.tsx`)
- **Constants**: `camelCase` (not SCREAMING_CASE) — `appRouter`, `spotsRouter`
- **Zustand stores**: `use[Name]Store` pattern — `useMapStore`

### TypeScript

- Strict mode is ON in all packages.
- Prefer `type` over `interface` for unions, intersections, and utility types. Use either for object shapes.
- Path alias: `@/*` maps to `./src/*` in `apps/web` and `apps/manager`.
- `apps/api` and all shared packages extend `@total-typescript/tsconfig` presets.
- Environment variables are validated at startup with `@t3-oss/env-core` + Zod (`apps/api/src/env.ts`, `apps/web/src/lib/env.ts`).

### React (apps/web and apps/manager)

- Functional components only. Type with `React.FC<Props>` or inline props.
- `react/react-in-jsx-scope` is OFF (React 19 JSX transform).
- `apps/web` — State: **Zustand** for map-related state, **Redux Toolkit** for mag/news/videos.
- `apps/manager` — State: local React state + React Query only.
- Styled-components (apps/web) are imported as `import * as S from './Component.styled'`.
- Data fetching: **oRPC + React Query** for all spot/map/admin data.
- Form validation: **Formik + Yup** in `apps/web`; **react-hook-form + Zod** in `apps/manager`.
- URL state: **nuqs** for query string state management.

### API (apps/api — Elysia + oRPC)

- Routes are defined as **oRPC procedures** on `@krak/contracts` and implemented in `apps/api`.
- All input/output shapes are defined with **Zod** in `packages/contracts`.
- Auth is handled by **BetterAuth** (`packages/auth`), not custom middleware.
- Database access goes through **Prisma** (`packages/prisma`) — no raw SQL or Mongoose.
- File uploads: use the S3/imgproxy pipeline (configured in env). Do not use Cloudinary for new code.
- CORS allows `(\w+\.)?skatekrak\.com$` origins; configured in Elysia via `@elysiajs/cors`.
- Cron jobs use `@elysiajs/cron` (example: weekly stats every Monday 8am).

### Database (packages/prisma)

- PostgreSQL 17 is the sole database. All entities are in the Prisma schema.
- Run migrations with `prisma migrate dev` from `packages/prisma`.
- The MongoDB driver dependency in `packages/prisma` exists only for the one-time migration scripts (`migrate-from-mongo.ts`, `migrate-maps.ts`) — do not use it for new features.

### Auth (packages/auth)

- **BetterAuth 1.2** wraps session and OAuth logic.
- Import the client from `@krak/auth/client` in frontend apps.
- Import the server instance from `@krak/auth` in `apps/api`.

### Shared UI (packages/ui)

- Built with **Radix UI** (headless primitives) + **Tailwind CSS 4**.
- Built via `tsdown`. Run `bun run build` inside the package to rebuild after changes.
- Import components as `import { Button } from '@krak/ui'`.

### Error Handling

- Use `try/catch` with `console.error()` for unexpected errors.
- `apps/api` uses Elysia's built-in error handling and `@bogeychan/elysia-logger`.
- Environment variable validation failures throw at startup, not at runtime.

## Infrastructure

- **Docker Compose** for local dev: `api`, `postgres`, `meilisearch` services.
    - PostgreSQL 17 on port 5433 (credentials: `krak`/`krak`, db: `krak`)
    - Meilisearch v1.13 on port 7700
- No Traefik reverse proxy in local dev — apps run directly on their respective ports.
- CI: GitHub Actions — `bun install --frozen-lockfile`, `oxlint`, `sherif`, `oxfmt --check`, `turbo build` on push to main.
- Deployments: Vercel (web), Dokploy (api, manager).

## Key Directories

### apps/web

```
src/
  components/   — React components (PascalCase dirs with index.ts barrel exports)
  pages/        — Next.js Pages Router (file-based routing)
  store/        — Zustand + Redux stores
  lib/          — Utilities, hooks, helpers
  server/       — Server-side utilities
  styles/       — Global styles (Tailwind + Stylus)
```

### apps/api

```
src/
  routers/      — oRPC procedure implementations
  lib/          — Auth, Prisma, Meilisearch, S3 clients
  env.ts        — Env validation (@t3-oss/env-core)
  index.ts      — Elysia app entry point
```

### apps/manager

```
src/
  app/          — Next.js App Router pages
  components/   — Admin UI components
  lib/          — oRPC client, auth hooks
```

## Common Pitfalls

- `apps/web` uses **Pages Router** (not App Router). Routes are in `src/pages/`. `apps/manager` uses App Router.
- The web app compiles Stylus CSS before the Next.js build (`build:style` script). This runs automatically via the Turborepo pipeline but watch for it on manual builds.
- Workspace packages (`@krak/contracts`, `@krak/types`, `@krak/ui`) are transpiled by Next.js via `transpilePackages` in `next.config.js`.
- The Prisma client must be generated (`prisma generate`) before the API can build. This happens automatically in the Turborepo pipeline.
- Always target the **PostgreSQL** database — there is no MongoDB in local dev or production anymore.
- `packages/trpc` is an empty dead package. Do not import from it or add code to it.
