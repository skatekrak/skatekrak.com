# AGENTS.md — Skatekrak Monorepo

## Project Overview

Bun + Turborepo monorepo for the Skatekrak skateboarding platform. Three apps and two shared packages.

| Package | Path | Tech | Deploys To |
|---|---|---|---|
| `@krak/web` | `apps/web` | Next.js 14 (Pages Router), React 18, Zustand, Redux Toolkit | Vercel |
| `@krak/api` | `apps/api` | Elysia (Bun), tRPC, MongoDB | Dokploy (custom server) |
| `@krak/carrelage` | `apps/carrelage` | Express, Mongoose, MongoDB | Not deployed |
| `@krak/trpc` | `packages/trpc` | tRPC router (spots, maps) | — |
| `@krak/carrelage-client` | `packages/carrelage-client` | Axios client + shared TS types | — |

Dependency chain: `web` -> `trpc` -> `carrelage-client`; `api` -> `trpc` -> `carrelage-client`.

## Build / Lint / Test Commands

Package manager is **Bun** (`bun@1.2.21`). Node engine: 24. Always use `bun` instead of npm/yarn/pnpm.

```bash
# Install dependencies
bun install

# Full monorepo
bun run build          # turbo build (all apps/packages)
bun run lint           # turbo lint + manypkg check
bun run dev            # turbo dev --parallel (all apps)

# Individual apps
bun run dev:web        # Next.js dev server (port 3000)
bun run dev:api        # Elysia dev with --watch (port 3000)
bun run dev:carrelage  # tsc-watch + restart (port 3636)

# Build individual apps
bun run build:api      # turbo build --filter=@krak/api
bun run build:carrelage # turbo build --filter=@krak/carrelage

# Lint individual apps
cd apps/web && bun run lint            # ESLint (no autofix)
cd apps/web && bun run style           # ESLint with --fix
cd apps/carrelage && bun run lint      # ESLint with --fix

# Tests (carrelage only — no tests in web or api)
cd apps/carrelage && bun run build     # Must compile TS first
cd apps/carrelage && bun run test:cmd:dev   # Mocha + nyc (needs running MongoDB)
cd apps/carrelage && bun run test:cmd:ci    # CI mode with 60s timeout
```

There is no single-test runner configured. Carrelage tests use Mocha on the compiled `dist/tests/tests.js` bundle — there is no way to run a single test file without modifying the test entry point.

## Formatting (Prettier)

Configured in root `.prettierrc`, applies to all packages:

- **Indentation**: 4 spaces
- **Quotes**: Single quotes (`'`)
- **Print width**: 120 characters
- **Trailing commas**: Always (`all`)
- **Arrow parens**: Always (`(x) => ...`)
- **Bracket spacing**: Yes (`{ foo }`)

VSCode is configured to format on save and auto-fix ESLint issues (`.vscode/settings.json`).

## Code Style Guidelines

### Imports

Order imports as: external packages, then internal workspace packages (`@krak/*`), then relative imports. Separate groups with a blank line.

```ts
import { ObjectId } from 'mongodb';
import { z } from 'zod';

import { type Spot, Status } from '@krak/carrelage-client';
import { publicProcedure, router } from '../trpc';
```

Use `import type { ... }` for type-only imports. This is enforced by TypeScript's `isolatedModules`.

### Naming Conventions

- **Variables / functions**: `camelCase` — `spotOverview`, `toggleFilter`, `createContext`
- **Types / Interfaces / Enums**: `PascalCase` — `SpotOverview`, `MapStore`, `Status`
- **React components**: `PascalCase` — `SpotCard`, `MapLayout`
- **Files**: `camelCase` for utilities/stores (`map.ts`, `spots.ts`), `PascalCase` for React components (`SpotCard.tsx`)
- **Constants**: `camelCase` (not SCREAMING_CASE) — `appRouter`, `spotsRouter`
- **Zustand stores**: `use[Name]Store` pattern — `useMapStore`

### TypeScript

- Strict mode is ON in all packages. `noImplicitAny` is OFF in `apps/web` but ON in `apps/carrelage`.
- Prefer `type` over `interface` for unions, intersections, and utility types. Use either for object shapes.
- `@typescript-eslint/no-explicit-any` is set to **warn** (not error). Avoid `any` but it won't block builds.
- Path alias: `@/*` maps to `./src/*` in `apps/web` (e.g., `import Foo from '@/components/Foo'`).
- `apps/api` and `packages/trpc` extend `@total-typescript/tsconfig` presets.

### React (apps/web)

- Functional components only. Type with `React.FC<Props>` or inline props.
- `react/react-in-jsx-scope` is OFF (React 17+ JSX transform).
- State management: **Zustand** for map-related state, **Redux Toolkit** for mag/news/videos.
- Styled-components are imported as `import * as S from './Component.styled'`.
- Data fetching: **tRPC + React Query** for spot/map data, **Axios** (via carrelage-client) for legacy endpoints.
- Form validation: **Formik + Yup** for forms, **Zod** for tRPC input schemas.
- URL state: **nuqs** for query string state management.

### tRPC (packages/trpc)

- Input validation with **Zod** schemas.
- Context provides `db` (MongoDB native client) — no Mongoose in the tRPC package.
- Procedures are grouped into routers (`spotsRouter`, `mapsRouter`) and merged into `appRouter`.

### Carrelage (apps/carrelage)

- Legacy Express REST API with Mongoose ODM.
- Uses **Joi** for request validation, **Bunyan** for structured logging.
- Error monitoring via **Bugsnag**.
- Stricter TS: `noImplicitAny`, `noUnusedLocals`, `noUnusedParameters` all enabled.

### Error Handling

- No centralized error handling utility. Use `try/catch` with `console.error()` in most cases.
- `apps/carrelage` uses Bugsnag for error tracking and Express error middleware.
- `apps/api` uses Elysia's built-in error handling.
- Environment variables are validated at startup with `@t3-oss/env-core` + Zod (`apps/api/src/env.ts`).

## Infrastructure

- **Docker Compose** for local dev: `web`, `api`, `carrelage`, `mongodb` services.
- Traefik reverse proxy routes: `dev.skatekrak.com` (web), `api.dev.skatekrak.com` (api), `carrelage.dev.skatekrak.com` (carrelage).
- MongoDB 7.0 on port 27017.
- CI: GitHub Actions — `bun install --frozen-lockfile && bun lint` on push to main, Vercel preview on PRs.

## Key Directories (apps/web)

```
src/
  components/   — React components (PascalCase dirs with index.ts barrel exports)
  pages/        — Next.js Pages Router (file-based routing)
  store/        — Zustand + Redux stores
  lib/          — Utilities, hooks, helpers
  server/       — Server-side utilities (tRPC)
  styles/       — Global styles (Tailwind + Stylus)
```

## Common Pitfalls

- `apps/web` uses **Next.js Pages Router** (not App Router). Routes are in `src/pages/`.
- The web app compiles Stylus CSS before the Next.js build (`build:style` script). Don't forget this step.
- Workspace packages (`@krak/trpc`, `@krak/carrelage-client`) are transpiled by Next.js via `transpilePackages` in `next.config.js`.
- The preview CI workflow still uses pnpm/Node 18 (legacy), but the main deploy uses Bun. Always use Bun locally.
- `apps/carrelage` tests require a running MongoDB instance and compiled TypeScript (`bun run build` first).
