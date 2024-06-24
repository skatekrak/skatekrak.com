# syntax = docker/dockerfile:1

ARG BUN_VERSION=1.1.12
FROM oven/bun:${BUN_VERSION}-slim as base

LABEL fly_launch_runtime="Bun"

# NodeJS app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV=production


# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install -y python-is-python3 pkg-config build-essential 

# Install node modules
COPY . .
RUN bun install
RUN bun run build:carrelage

# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

EXPOSE 3636

# Start the server by default, this can be overwritten at runtime
CMD [ "bun", "start:carrelage"]
