import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '@krak/prisma';

import { env } from '../env';

/**
 * Creates a fresh PrismaClient connected to the PostgreSQL database.
 * Each job is responsible for disconnecting it when done (see `runJob`).
 */
export function createPrismaClient(): PrismaClient {
    const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
    return new PrismaClient({ adapter });
}
