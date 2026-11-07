import { parseArgs } from 'node:util';

import { createCountryInput } from '@krak/contracts';
import type { PrismaClient } from '@krak/prisma';
import { countrySlug } from '@krak/utils';

import catalog from '../../../../apps/manager/public/data/countries.json';

const normalizeCountryName = (value: string) => countrySlug(value.replaceAll('&', ' and ')).replaceAll('-', '');

function editDistance(left: string, right: string) {
    const rows = Array.from({ length: left.length + 1 }, (_, index) => [index, ...Array<number>(right.length).fill(0)]);
    for (let column = 0; column <= right.length; column++) rows[0]![column] = column;
    for (let row = 1; row <= left.length; row++) {
        for (let column = 1; column <= right.length; column++) {
            rows[row]![column] = Math.min(
                rows[row - 1]![column]! + 1,
                rows[row]![column - 1]! + 1,
                rows[row - 1]![column - 1]! + (left[row - 1] === right[column - 1] ? 0 : 1),
            );
            if (row > 1 && column > 1 && left[row - 1] === right[column - 2] && left[row - 2] === right[column - 1]) {
                rows[row]![column] = Math.min(rows[row]![column]!, rows[row - 2]![column - 2]! + 1);
            }
        }
    }
    return rows[left.length]![right.length]!;
}

function fuzzyCountryMatch(values: string[]) {
    const inputs = values.map(normalizeCountryName).filter((value) => value.length >= 5);
    const ranked = catalog.countries
        .map((country) => {
            const name = normalizeCountryName(country.name);
            const score = Math.max(
                0,
                ...inputs.map((input) =>
                    name.length < 5 ? 0 : 1 - editDistance(input, name) / Math.max(input.length, name.length),
                ),
            );
            return { country, score };
        })
        // oxlint-disable-next-line unicorn/no-array-sort -- This array is new; the jobs TS target lacks toSorted.
        .sort((a, b) => b.score - a.score);
    const [best, runnerUp] = ranked;
    // Geographic near-neighbours must not be chosen on a weak match or a narrow lead.
    if (!best || best.score < 0.8 || best.score - (runnerUp?.score ?? 0) < 0.1) return;
    return best;
}

function countryMatches(map: { id: string; name: string }) {
    const keys = new Set([countrySlug(map.id), countrySlug(map.name)]);
    const matches = catalog.countries.filter(({ slug, code }) => keys.has(slug) || keys.has(code.toLowerCase()));
    if (matches.length > 0) return { matches, fuzzyScore: undefined };
    const fuzzy = fuzzyCountryMatch([map.id, map.name]);
    return { matches: fuzzy ? [fuzzy.country] : [], fuzzyScore: fuzzy?.score };
}

function promptCountryCode(map: { id: string; name: string }) {
    while (true) {
        const answer = prompt(
            `No unique match for "${map.id}" (${map.name}).\nEnter a country ISO code (e.g. FR), or Enter/skip to skip:`,
            '',
        );
        if (answer === null) throw new Error('Matching cancelled before migration. No changes were made.');
        const code = answer.trim().toUpperCase();
        if (!code || code === 'SKIP') return null;
        const country = catalog.countries.find((entry) => entry.code === code);
        if (country) return country.code;
        console.error(`Unknown country code "${code}". Enter a two-letter code from the catalog, or skip.`);
    }
}

export async function migrateCountryMaps(prisma: PrismaClient, apply = false, match = false) {
    const decisions = new Map<string, { code: string | null; updatedAt: number }>();
    if (match) {
        const maps = await prisma.map.findMany({ where: { categories: { has: 'countries' } }, orderBy: { id: 'asc' } });
        for (const map of maps) {
            if (countryMatches(map).matches.length !== 1) {
                decisions.set(map.id, { code: promptCountryCode(map), updatedAt: map.updatedAt.getTime() });
            }
        }
    }

    return prisma.$transaction(
        async (tx) => {
            const maps = await tx.map.findMany({ where: { categories: { has: 'countries' } }, orderBy: { id: 'asc' } });
            const existing = await tx.country.findMany({ select: { id: true, code: true } });
            const ids = new Set(existing.map(({ id }) => id));
            const codes = new Set(existing.map(({ code }) => code));
            const countries = maps.flatMap((map) => {
                if (ids.has(map.id)) {
                    throw new Error(`Country ID already exists: ${map.id}. Nothing was overwritten.`);
                }
                const decision = decisions.get(map.id);
                if (decision && decision.updatedAt !== map.updatedAt.getTime()) {
                    throw new Error(
                        `Country map "${map.id}" changed during matching. Re-run the job; nothing was migrated.`,
                    );
                }
                if (decision?.code === null) {
                    console.log(`Skipping country map "${map.id}" (${map.name}): skipped by user.`);
                    return [];
                }
                const { matches: automaticMatches, fuzzyScore } = countryMatches(map);
                const matches = decision
                    ? catalog.countries.filter(({ code }) => code === decision.code)
                    : automaticMatches;
                if (decision) {
                    console.log(`Manual match: "${map.id}" (${map.name}) -> ${matches[0]!.name} (${decision.code}).`);
                } else if (fuzzyScore !== undefined) {
                    console.log(
                        `Fuzzy match: "${map.id}" (${map.name}) -> ${matches[0]!.name} (${matches[0]!.code}), ${Math.round(fuzzyScore * 100)}% similarity.`,
                    );
                }
                if (matches.length !== 1) {
                    console.error(
                        `Skipping country map "${map.id}" (${map.name}): ${matches.length ? 'ambiguous' : 'no confident'} catalog matches. Re-run with --match or use the explicit metadata migration.`,
                    );
                    return [];
                }
                const metadata = matches[0]!;
                if (codes.has(metadata.code)) {
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
                return [
                    {
                        ...input,
                        bounds: metadata.bounds.flat(),
                        createdAt: map.createdAt,
                        updatedAt: map.updatedAt,
                    },
                ];
            });

            for (const country of countries) {
                console.log(`${apply ? 'Migrating' : 'Would migrate'}: ${country.id} (${country.code})`);
                if (apply) {
                    await tx.country.create({ data: country });
                    await tx.map.delete({ where: { id: country.id } });
                }
            }
            console.log(
                `${countries.length} country map(s) ${apply ? 'migrated' : 'ready to migrate'}; ${maps.length - countries.length} skipped.`,
            );
            // Include existing countries so reruns can retry search cleanup after the maps are gone.
            return [...ids];
        },
        { isolationLevel: 'Serializable', timeout: 30000 },
    );
}

if (import.meta.main) {
    const { values } = parseArgs({
        options: { apply: { type: 'boolean', default: false }, match: { type: 'boolean', default: false } },
        strict: true,
    });
    if (values.match && !process.stdin.isTTY) throw new Error('--match requires an interactive terminal.');
    const { runJob } = await import('../lib/runJob');
    await runJob('migrate-countries', async ({ prisma }) => {
        const ids = await migrateCountryMaps(prisma, values.apply, values.match);
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
