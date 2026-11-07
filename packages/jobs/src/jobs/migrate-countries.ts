import { parseArgs } from 'node:util';

import { createCountryInput } from '@krak/contracts';
import type { PrismaClient } from '@krak/prisma';
import { countrySlug } from '@krak/utils';

import catalog from '../../../../apps/manager/public/data/countries.json';

export async function migrateCountryMaps(prisma: PrismaClient, apply = false) {
    return prisma.$transaction(
        async (tx) => {
            const maps = await tx.map.findMany({ where: { categories: { has: 'countries' } }, orderBy: { id: 'asc' } });
            const existing = await tx.country.findMany({ select: { id: true, code: true } });
            const ids = new Set(existing.map(({ id }) => id));
            const codes = new Set(existing.map(({ code }) => code));
            const countries = maps.map((map) => {
                const keys = new Set([countrySlug(map.id), countrySlug(map.name)]);
                const matches = catalog.countries.filter(
                    ({ slug, code }) => keys.has(slug) || keys.has(code.toLowerCase()),
                );
                if (matches.length !== 1) {
                    throw new Error(
                        `Country map "${map.id}" (${map.name}) has ${matches.length ? 'ambiguous' : 'no'} catalog matches. Use the explicit metadata migration for this map.`,
                    );
                }
                const metadata = matches[0]!;
                if (ids.has(map.id) || codes.has(metadata.code)) {
                    throw new Error(
                        `Country ID or code already exists: ${map.id} (${metadata.code}). Nothing was overwritten.`,
                    );
                }
                ids.add(map.id);
                codes.add(metadata.code);
                const input = {
                    id: map.id,
                    code: metadata.code,
                    name: map.name,
                    subtitle: map.subtitle,
                    edito: map.edito,
                    about: map.about,
                    videos: map.videos,
                    soundtrack: map.soundtrack,
                    bounds: metadata.bounds,
                    hidden: map.staging,
                };
                // Validate without trimming or otherwise rewriting legacy editorial content.
                createCountryInput.parse(input);
                return {
                    ...input,
                    bounds: metadata.bounds.flat(),
                    createdAt: map.createdAt,
                    updatedAt: map.updatedAt,
                };
            });

            for (const country of countries) {
                console.log(`${apply ? 'Migrating' : 'Would migrate'}: ${country.id} (${country.code})`);
                if (apply) {
                    await tx.country.create({ data: country });
                    await tx.map.delete({ where: { id: country.id } });
                }
            }
            console.log(`${countries.length} country map(s) ${apply ? 'migrated' : 'ready to migrate'}.`);
            // Include existing countries so reruns can retry search cleanup after the maps are gone.
            return [...ids];
        },
        { isolationLevel: 'Serializable', timeout: 30000 },
    );
}

if (import.meta.main) {
    const { values } = parseArgs({ options: { apply: { type: 'boolean', default: false } }, strict: true });
    const { runJob } = await import('../lib/runJob');
    await runJob('migrate-countries', async ({ prisma }) => {
        const ids = await migrateCountryMaps(prisma, values.apply);
        if (!values.apply) {
            console.log('Dry run complete. Add --apply to migrate. No database or search changes were made.');
            return;
        }
        if (ids.length > 0) {
            try {
                const { default: meilisearch, mapIndex } = await import('../lib/meilisearch');
                const task = await mapIndex.deleteDocuments(ids);
                const result = await meilisearch.tasks.waitForTask(task.taskUid);
                if (result.status !== 'succeeded') throw new Error(result.error?.message ?? result.status);
            } catch (error) {
                throw new Error(
                    'Countries migrated, but search cleanup failed. Re-run this job with --apply to retry.',
                    {
                        cause: error,
                    },
                );
            }
        }
        console.log('Country migration complete. Existing image assets, spots and spot tags were not changed.');
    });
}
