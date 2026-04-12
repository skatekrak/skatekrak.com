#!/bin/sh
set -e

echo "Running Prisma migrations..."
cd /app/packages/prisma
bunx prisma migrate deploy
echo "Migrations applied successfully."

cd /app
exec bun start:api
