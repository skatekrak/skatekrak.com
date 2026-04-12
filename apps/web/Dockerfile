ARG BUN_VERSION=1.3.10
FROM oven/bun:${BUN_VERSION}-slim AS base

# NodeJS app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Throw-away build stage to reduce size of final image
FROM base AS build

# Install packages needed to build node modules
RUN apt-get update -qq && \
  apt-get install -y python-is-python3 pkg-config build-essential 

# Install node modules
COPY . .
RUN bun install --frozen-lockfile
RUN bun run build:web
RUN bun install --production --frozen-lockfile

FROM base

COPY --from=build /app /app
EXPOSE 3000

CMD ["bun", "start:web"]
