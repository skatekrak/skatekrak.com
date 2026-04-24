# syntax = docker/dockerfile:1

ARG BUN_VERSION=1.3.10
FROM oven/bun:${BUN_VERSION}-slim AS base
WORKDIR /app
ENV NODE_ENV=production

# ---------------------------------------------------------------------------
# Build stage
# ---------------------------------------------------------------------------
FROM base AS build

RUN apt-get update -qq && \
  apt-get install --no-install-recommends -y python-is-python3 pkg-config build-essential && \
  rm -rf /var/lib/apt/lists/*

# Dependency cache layer — only re-runs when manifests or lockfile change
COPY package.json bun.lock ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY apps/manager/package.json apps/manager/
COPY packages/auth/package.json packages/auth/
COPY packages/contracts/package.json packages/contracts/
COPY packages/prisma/package.json packages/prisma/
COPY packages/types/package.json packages/types/
COPY packages/trpc/package.json packages/trpc/
COPY packages/ui/package.json packages/ui/
COPY packages/utils/package.json packages/utils/

RUN bun install --frozen-lockfile

# Copy only source needed for @krak/api and its workspace deps
COPY turbo.json ./
COPY apps/api/ apps/api/
COPY packages/ packages/

RUN bun run build:api

# ---------------------------------------------------------------------------
# Runtime stage — bundle + sharp native bindings
# ---------------------------------------------------------------------------
FROM base

# Install sharp and all its dependencies (native bindings + transitive deps)
# in a standalone node_modules for the runtime image
RUN bun install --no-save sharp@0.34.5

COPY --from=build /app/apps/api/dist/index.js ./index.js

EXPOSE 3000
CMD ["bun", "run", "index.js"]
