import type { PrismaClient } from '@krak/prisma';

import { createPrismaClient } from './prisma';

type JobFn = (ctx: { prisma: PrismaClient }) => Promise<void>;

/**
 * Boilerplate runner for one-off jobs.
 * - Opens a database connection
 * - Runs the job
 * - Always disconnects
 * - Exits with code 1 on failure
 */
export async function runJob(name: string, fn: JobFn): Promise<void> {
    const startedAt = Date.now();
    console.log(`[${name}] starting...`);

    const prisma = createPrismaClient();

    try {
        await fn({ prisma });
        console.log(`[${name}] done in ${((Date.now() - startedAt) / 1000).toFixed(2)}s`);
    } catch (err) {
        console.error(`[${name}] failed:`, err);
        process.exitCode = 1;
    } finally {
        await prisma.$disconnect();
    }
}
