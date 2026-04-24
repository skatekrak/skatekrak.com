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

# sharp requires libvips at runtime
RUN apt-get update -qq && \
  apt-get install --no-install-recommends -y libvips-dev && \
  rm -rf /var/lib/apt/lists/*

COPY --from=build /app/apps/api/dist/index.js ./index.js
COPY --from=build /app/node_modules/sharp ./node_modules/sharp
COPY --from=build /app/node_modules/@img ./node_modules/@img

EXPOSE 3000
CMD ["bun", "run", "index.js"]
