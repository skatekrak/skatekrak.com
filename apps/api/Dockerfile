# syntax = docker/dockerfile:1

ARG BUN_VERSION=1.1.12
FROM oven/bun:${BUN_VERSION}-slim AS base

LABEL fly_launch_runtime="nodejs"

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
RUN bun install --production --frozen-lockfile

# Final stage for app image
FROM node:lts-slim 

# Copy built application
COPY --from=build /app /app

EXPOSE 3000

# Start the server by default, this can be overwritten at runtime
CMD [ "npm", "run", "start:api" ]
