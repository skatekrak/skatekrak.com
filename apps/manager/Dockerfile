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
COPY apps/manager/package.json apps/manager/
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY packages/auth/package.json packages/auth/
COPY packages/contracts/package.json packages/contracts/
COPY packages/prisma/package.json packages/prisma/
COPY packages/types/package.json packages/types/
COPY packages/trpc/package.json packages/trpc/
COPY packages/ui/package.json packages/ui/
COPY packages/utils/package.json packages/utils/

RUN bun install --frozen-lockfile

# Copy source needed for @krak/manager and its workspace deps
COPY turbo.json ./
COPY apps/manager/ apps/manager/
COPY packages/ packages/

# NEXT_PUBLIC_ vars are inlined at build time — pass via --build-arg
ARG NEXT_PUBLIC_KRAK_API_URL
ENV NEXT_PUBLIC_KRAK_API_URL=$NEXT_PUBLIC_KRAK_API_URL
ARG NEXT_PUBLIC_IMGPROXY_URL
ENV NEXT_PUBLIC_IMGPROXY_URL=$NEXT_PUBLIC_IMGPROXY_URL

RUN bunx turbo build --filter=@krak/manager

# ---------------------------------------------------------------------------
# Runtime stage — standalone Next.js server + Node.js
# ---------------------------------------------------------------------------
FROM node:24-slim

WORKDIR /app
ENV NODE_ENV=production

# Next.js standalone output (server + minimal node_modules)
COPY --from=build /app/apps/manager/.next/standalone ./
# Static assets (JS/CSS bundles, images, etc.)
COPY --from=build /app/apps/manager/.next/static ./apps/manager/.next/static

# Bind to 0.0.0.0 so the container is reachable from outside
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

EXPOSE 3000
CMD ["node", "apps/manager/server.js"]
