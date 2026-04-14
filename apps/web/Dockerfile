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
COPY apps/web/package.json apps/web/
COPY apps/api/package.json apps/api/
COPY apps/manager/package.json apps/manager/
COPY packages/auth/package.json packages/auth/
COPY packages/contracts/package.json packages/contracts/
COPY packages/prisma/package.json packages/prisma/
COPY packages/types/package.json packages/types/
COPY packages/ui/package.json packages/ui/

RUN --mount=type=cache,target=/root/.bun/install/cache \
  bun install --frozen-lockfile

# Copy source needed for @krak/web and its workspace deps
COPY turbo.json ./
COPY apps/web/ apps/web/
COPY packages/ packages/

# NEXT_PUBLIC_ vars are inlined at build time — pass via --build-arg
ARG NEXT_PUBLIC_CARRELAGE_URL
ARG NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
ARG NEXT_PUBLIC_KRAK_API_URL
ARG NEXT_PUBLIC_STAGE=production
ARG NEXT_PUBLIC_MEILI_HOST
ARG NEXT_PUBLIC_MEILI_API_KEY
ARG NEXT_PUBLIC_IMGPROXY_URL

ENV NEXT_PUBLIC_CARRELAGE_URL=$NEXT_PUBLIC_CARRELAGE_URL
ENV NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=$NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
ENV NEXT_PUBLIC_KRAK_API_URL=$NEXT_PUBLIC_KRAK_API_URL
ENV NEXT_PUBLIC_STAGE=$NEXT_PUBLIC_STAGE
ENV NEXT_PUBLIC_MEILI_HOST=$NEXT_PUBLIC_MEILI_HOST
ENV NEXT_PUBLIC_MEILI_API_KEY=$NEXT_PUBLIC_MEILI_API_KEY
ENV NEXT_PUBLIC_IMGPROXY_URL=$NEXT_PUBLIC_IMGPROXY_URL

RUN bunx turbo build --filter=@krak/web

# ---------------------------------------------------------------------------
# Runtime stage — standalone Next.js server + Bun
# ---------------------------------------------------------------------------
FROM base

# Next.js standalone output (server + minimal node_modules)
COPY --from=build /app/apps/web/.next/standalone ./
# Static assets (JS/CSS bundles, images, etc.)
COPY --from=build /app/apps/web/.next/static ./apps/web/.next/static
# Public files (fonts, images, styles)
COPY --from=build /app/apps/web/public ./apps/web/public

# Bind to 0.0.0.0 so the container is reachable from outside
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

EXPOSE 3000
CMD ["bun", "apps/web/server.js"]
