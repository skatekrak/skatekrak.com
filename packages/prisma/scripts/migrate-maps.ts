/**
 * Custom Maps Migration Script
 *
 * Reads the _spots.json file from apps/api/src/data/customMaps/ and inserts
 * each entry into the PostgreSQL `maps` table defined by the Prisma schema.
 *
 * Prerequisites:
 *   1. PostgreSQL is running and the schema has been migrated:
 *      DATABASE_URL="postgresql://krak:krak@localhost:5433/krak" bunx --bun prisma migrate deploy
 *
 * Usage:
 *   DATABASE_URL="postgresql://krak:krak@localhost:5433/krak" \
 *   bun run packages/prisma/scripts/migrate-maps.ts
 *
 * The script is idempotent: it wipes the maps table before inserting.
 */

import { PrismaPg } from '@prisma/adapter-pg';
import { resolve } from 'path';

import { PrismaClient } from '../node_modules/.prisma/client';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MapEntry {
    id: string;
    categories: string[];
    name: string;
    subtitle?: string;
    edito?: string;
    about?: string;
    staging?: boolean;
    videos?: string[];
    soundtrack?: string[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function log(msg: string) {
    console.log(`[migrate-maps] ${new Date().toISOString()} — ${msg}`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
    log('=== Custom Maps Migration ===');
    log(`PostgreSQL: using DATABASE_URL from environment`);
    log('');

    // Load JSON data
    const jsonPath = resolve(__dirname, '../../../apps/api/src/data/customMaps/_spots.json');
    const file = Bun.file(jsonPath);
    const entries: MapEntry[] = await file.json();
    log(`Loaded ${entries.length} map entries from _spots.json`);

    // Connect to PostgreSQL
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
    const prisma = new PrismaClient({ adapter });

    try {
        await prisma.$connect();
        log('Connected to PostgreSQL via Prisma');
        log('');

        // Wipe existing maps
        log('Wiping maps table...');
        await prisma.map.deleteMany();
        log('  Maps table wiped');
        log('');

        // Insert all maps in a single batch
        log('Inserting maps...');
        const result = await prisma.map.createMany({
            data: entries.map((entry) => ({
                id: entry.id,
                categories: entry.categories ?? [],
                name: entry.name,
                subtitle: entry.subtitle ?? '',
                edito: entry.edito ?? '',
                about: entry.about ?? '',
                staging: entry.staging ?? false,
                videos: (entry.videos ?? []).filter((v) => v.length > 0),
                soundtrack: (entry.soundtrack ?? []).filter((s) => s.length > 0),
            })),
        });

        log(`  Inserted ${result.count} maps`);
        log('');
        log('=== Migration complete ===');
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
