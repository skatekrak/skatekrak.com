import { PrismaPg } from '@prisma/adapter-pg';
import { z } from 'zod';

import { createCountryInput } from '@krak/contracts';
import { PrismaClient } from '@krak/prisma';

export const metadataSchema = z
    .array(createCountryInput.pick({ id: true, code: true, bounds: true }))
    .superRefine((entries, context) => {
        if (
            new Set(entries.map(({ id }) => id)).size !== entries.length ||
            new Set(entries.map(({ code }) => code)).size !== entries.length
        ) {
            context.addIssue({ code: 'custom', message: 'Country IDs and country codes must be unique' });
        }
    });

async function main() {
    const file = process.argv[2];
    const apply = process.argv.includes('--apply');
    if (!file || file.startsWith('--')) throw new Error('Usage: bun run migrate:countries <metadata.json> [--apply]');
    const entries = metadataSchema.parse(await Bun.file(file).json());
    const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

    try {
        await prisma.$transaction(
            async (tx) => {
                for (const metadata of entries) {
                    const map = await tx.map.findUnique({ where: { id: metadata.id } });
                    const existing = await tx.country.findUnique({ where: { id: metadata.id } });
                    if (!map && existing?.code === metadata.code) {
                        console.log(`Already migrated: ${metadata.id}`);
                        continue;
                    }
                    if (!map?.categories.includes('countries'))
                        throw new Error(`Country map not found: ${metadata.id}`);
                    if (existing) throw new Error(`Country already exists: ${metadata.id}. No data was overwritten.`);
                    if (await tx.country.findUnique({ where: { code: metadata.code } }))
                        throw new Error(`Country code already exists: ${metadata.code}`);

                    const country = createCountryInput.parse({ ...map, ...metadata, hidden: map.staging });
                    console.log(`${apply ? 'Migrating' : 'Would migrate'}: ${metadata.id} (${metadata.code})`);
                    if (apply) {
                        await tx.country.create({
                            data: {
                                ...country,
                                bounds: country.bounds.flat(),
                                createdAt: map.createdAt,
                                updatedAt: map.updatedAt,
                            },
                        });
                        await tx.map.delete({ where: { id: map.id } });
                    }
                }
            },
            { isolationLevel: 'Serializable', timeout: 30000 },
        );

        if (apply && entries.length > 0) {
            const { default: meilisearch, mapIndex } = await import('../helpers/meilisearch');
            const task = await mapIndex.deleteDocuments(entries.map(({ id }) => id));
            const result = await meilisearch.tasks.waitForTask(task.taskUid);
            if (result.status !== 'succeeded')
                throw new Error('Countries migrated, but search cleanup failed. Re-run the same command to retry.');
        }
        console.log(
            apply
                ? 'Country migration complete. Existing image paths and spot tags were preserved.'
                : 'Dry run complete. Add --apply to migrate.',
        );
    } finally {
        await prisma.$disconnect();
    }
}

if (import.meta.main) {
    main().catch((error) => {
        console.error('Country migration failed:', error);
        process.exitCode = 1;
    });
}
