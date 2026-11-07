import { expect, test } from 'bun:test';

import type { Country, Map, Prisma, PrismaClient } from '@krak/prisma';

import { migrateCountryMaps } from './migrate-countries';

const france: Map = {
    id: 'legacy-france-guide',
    name: 'France',
    categories: ['countries'],
    subtitle: 'Existing subtitle',
    edito: '  Existing editorial  ',
    about: 'Existing about',
    videos: ['https://example.com/video'],
    soundtrack: ['  Artist - Track  '],
    staging: false,
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date('2021-01-01'),
};

function database(maps: Map[], countries: Country[] = [], failWrite?: string) {
    let storedMaps = structuredClone(maps);
    let storedCountries = structuredClone(countries);
    const writes: string[] = [];
    const prisma = {
        $transaction: async (
            callback: (tx: Prisma.TransactionClient) => Promise<string[]>,
            options: { isolationLevel: string; timeout: number },
        ) => {
            expect(options).toEqual({ isolationLevel: 'Serializable', timeout: 30000 });
            let nextMaps = structuredClone(storedMaps);
            const nextCountries = structuredClone(storedCountries);
            const tx = {
                map: {
                    findMany: async (args: Prisma.MapFindManyArgs) => {
                        expect(args).toEqual({ where: { categories: { has: 'countries' } }, orderBy: { id: 'asc' } });
                        return nextMaps.filter(({ categories }) => categories.includes('countries'));
                    },
                    delete: async ({ where }: Prisma.MapDeleteArgs) => {
                        writes.push(`delete:${where.id}`);
                        if (failWrite === `delete:${where.id}`) throw new Error('Database write failed');
                        nextMaps = nextMaps.filter(({ id }) => id !== where.id);
                    },
                },
                country: {
                    findMany: async () => nextCountries.map(({ id, code }) => ({ id, code })),
                    create: async ({ data }: { data: Country }) => {
                        writes.push(`create:${data.id}`);
                        if (failWrite === `create:${data.id}`) throw new Error('Database write failed');
                        nextCountries.push(data);
                    },
                },
            };
            const result = await callback(tx as unknown as Prisma.TransactionClient);
            storedMaps = nextMaps;
            storedCountries = nextCountries;
            return result;
        },
    };
    return {
        prisma: prisma as unknown as PrismaClient,
        writes,
        maps: () => storedMaps,
        countries: () => storedCountries,
    };
}

test('dry run selects only country maps, validates the migration and performs no writes', async () => {
    const regularMap = { ...france, id: 'regular-map', categories: ['maps'] };
    const db = database([france, regularMap]);
    expect(await migrateCountryMaps(db.prisma)).toEqual([france.id]);
    expect(db.writes).toEqual([]);
    expect(db.maps()).toEqual([france, regularMap]);
    expect(db.countries()).toEqual([]);
});

test('apply preserves legacy IDs, editorial content, dates and visibility, and moves only country maps', async () => {
    const regularMap = { ...france, id: 'regular-map', categories: ['maps'] };
    const db = database([france, regularMap]);
    expect(await migrateCountryMaps(db.prisma, true)).toEqual([france.id]);
    expect(db.countries()).toEqual([
        {
            id: france.id,
            code: 'FR',
            name: france.name,
            subtitle: france.subtitle,
            edito: france.edito,
            about: france.about,
            videos: france.videos,
            soundtrack: france.soundtrack,
            bounds: [-5.134723, 41.364166, 9.562222, 51.09111],
            hidden: false,
            createdAt: france.createdAt,
            updatedAt: france.updatedAt,
        },
    ]);
    expect(db.writes).toEqual([`create:${france.id}`, `delete:${france.id}`]);
    expect(db.maps()).toEqual([regularMap]);

    db.writes.length = 0;
    expect(await migrateCountryMaps(db.prisma, true)).toEqual([france.id]);
    expect(db.writes).toEqual([]);
    expect(db.countries()).toHaveLength(1);
});

test('country matching handles names, slugs, codes and dateline bounds without changing staging', async () => {
    const db = database([
        { ...france, id: 'fiji', name: 'FJ', staging: true },
        { ...france, id: 'custom-country', name: 'Curacao' },
    ]);
    await migrateCountryMaps(db.prisma, true);
    expect(db.countries().map(({ id, code, hidden }) => ({ id, code, hidden }))).toEqual([
        { id: 'fiji', code: 'FJ', hidden: true },
        { id: 'custom-country', code: 'CW', hidden: false },
    ]);
    expect(db.countries()[0]!.bounds[2]).toBeGreaterThan(180);
});

test('unknown, contradictory or duplicate country matches abort before any writes', async () => {
    for (const map of [
        { ...france, id: 'unknown-country', name: 'Unknown country' },
        { ...france, id: 'germany', name: 'France' },
        { ...france, id: 'another-france', name: 'France' },
        { ...france, id: 'bad-video', name: 'Germany', videos: ['not a URL'] },
    ]) {
        const db = database([france, map]);
        await expect(migrateCountryMaps(db.prisma, true)).rejects.toThrow();
        expect(db.writes).toEqual([]);
        expect(db.maps()).toEqual([france, map]);
        expect(db.countries()).toEqual([]);
    }
});

test('existing country IDs or ISO codes are never overwritten or merged', async () => {
    const migrated = database([france]);
    await migrateCountryMaps(migrated.prisma, true);
    const country = migrated.countries()[0]!;
    for (const existing of [country, { ...country, id: 'another-france' }, { ...country, code: 'DE' }]) {
        const db = database([france], [existing]);
        await expect(migrateCountryMaps(db.prisma, true)).rejects.toThrow('already exists');
        expect(db.writes).toEqual([]);
        expect(db.countries()).toEqual([existing]);
        expect(db.maps()).toEqual([france]);
    }
});

test('create or delete failures reject the transaction, including failures after an earlier map moved', async () => {
    const germany = { ...france, id: 'germany', name: 'Germany' };
    for (const failWrite of [`create:${france.id}`, `delete:${france.id}`, `create:${germany.id}`]) {
        const db = database([france, germany], [], failWrite);
        await expect(migrateCountryMaps(db.prisma, true)).rejects.toThrow('Database write failed');
        expect(db.maps()).toEqual([france, germany]);
        expect(db.countries()).toEqual([]);
        expect(db.writes.at(-1)).toBe(failWrite);
    }
});
