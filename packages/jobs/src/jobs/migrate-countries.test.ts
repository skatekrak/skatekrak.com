import { afterEach, expect, mock, spyOn, test } from 'bun:test';

import type { Country, Map, Prisma, PrismaClient } from '@krak/prisma';

import catalog from '../../../../apps/manager/public/data/countries.json';
import { migrateCountryMaps } from './migrate-countries';

afterEach(() => mock.restore());

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
    let transactionStarted = false;
    const prisma = {
        map: {
            findMany: async (args: Prisma.MapFindManyArgs) => {
                expect(args).toEqual({ where: { categories: { has: 'countries' } }, orderBy: { id: 'asc' } });
                return structuredClone(storedMaps.filter(({ categories }) => categories.includes('countries')));
            },
        },
        $transaction: async (
            callback: (tx: Prisma.TransactionClient) => Promise<string[]>,
            options: { isolationLevel: string; timeout: number },
        ) => {
            transactionStarted = true;
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
        transactionStarted: () => transactionStarted,
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

test('unmatched and ambiguous maps are logged and skipped while later countries continue', async () => {
    const unknown = { ...france, id: 'unknown-country', name: 'Unknown country' };
    const contradictory = { ...france, id: 'germany', name: 'France' };
    const japan = { ...france, id: 'japan', name: 'Japan' };
    const maps = [unknown, france, contradictory, japan];
    const errors = spyOn(console, 'error').mockImplementation(() => {});

    for (const apply of [false, true]) {
        errors.mockClear();
        const db = database(maps);
        expect(await migrateCountryMaps(db.prisma, apply)).toEqual([france.id, japan.id]);
        expect(errors).toHaveBeenCalledTimes(2);
        expect(errors).toHaveBeenCalledWith(expect.stringContaining('Skipping country map "unknown-country"'));
        expect(errors).toHaveBeenCalledWith(expect.stringContaining('ambiguous catalog matches'));
        expect(db.maps()).toEqual(apply ? [unknown, contradictory] : maps);
        expect(db.countries().map(({ id }) => id)).toEqual(apply ? [france.id, japan.id] : []);
        expect(db.writes).toEqual(
            apply ? [`create:${france.id}`, `delete:${france.id}`, 'create:japan', 'delete:japan'] : [],
        );
    }
});

test('a batch with no matching country maps logs errors and succeeds without writes', async () => {
    const map = { ...france, id: 'unknown-country', name: 'Unknown country' };
    const db = database([map]);
    const errors = spyOn(console, 'error').mockImplementation(() => {});
    expect(await migrateCountryMaps(db.prisma, true)).toEqual([]);
    expect(errors).toHaveBeenCalledWith(expect.stringContaining('no confident catalog matches'));
    expect(db.maps()).toEqual([map]);
    expect(db.countries()).toEqual([]);
    expect(db.writes).toEqual([]);
});

test('fuzzy fallback finds joined names, ampersands and typos, logs its choices and preserves source values', async () => {
    const cases = [
        { id: 'antiguaandbarbuda', name: 'Antigua & Barbuda', code: 'AG' },
        { id: 'portgual', name: 'Portgual', code: 'PT' },
        { id: 'frnace', name: 'Frnace', code: 'FR' },
        { id: 'legacy-uk-guide', name: 'United Kngdom', code: 'GB' },
    ];
    const maps = cases.map(({ id, name }) => ({ ...france, id, name }));
    const logs = spyOn(console, 'log').mockImplementation(() => {});
    const errors = spyOn(console, 'error').mockImplementation(() => {});
    for (const apply of [false, true]) {
        logs.mockClear();
        const db = database(maps);
        expect(await migrateCountryMaps(db.prisma, apply)).toEqual(cases.map(({ id }) => id));
        expect(logs.mock.calls.filter(([message]) => String(message).startsWith('Fuzzy match:'))).toHaveLength(
            cases.length,
        );
        expect(logs).toHaveBeenCalledWith(expect.stringContaining('-> Antigua and Barbuda (AG), 100% similarity'));
        expect(errors).not.toHaveBeenCalled();
        expect(db.countries().map(({ id, name, code }) => ({ id, name, code }))).toEqual(apply ? cases : []);
        expect(db.maps()).toEqual(apply ? [] : maps);
        expect(db.writes).toHaveLength(apply ? cases.length * 2 : 0);
    }
});

test('fuzzy fallback does not guess short names or close alternatives', async () => {
    const maps = ['ZZ', 'Chadd', 'Korea', 'Austrlia', 'Nigea'].map((name, index) => ({
        ...france,
        id: `unmatched-${index}`,
        name,
    }));
    const errors = spyOn(console, 'error').mockImplementation(() => {});
    const db = database(maps);
    expect(await migrateCountryMaps(db.prisma, true)).toEqual([]);
    expect(errors).toHaveBeenCalledTimes(maps.length);
    expect(db.maps()).toEqual(maps);
    expect(db.writes).toEqual([]);
});

test('exact matches keep priority for similar country names', async () => {
    const cases = [
        { id: 'niger', name: 'Niger', code: 'NE' },
        { id: 'nigeria', name: 'Nigeria', code: 'NG' },
        { id: 'austria', name: 'Austria', code: 'AT' },
        { id: 'australia', name: 'Australia', code: 'AU' },
        { id: 'guinea', name: 'Guinea', code: 'GN' },
        { id: 'equatorial-guinea', name: 'Equatorial Guinea', code: 'GQ' },
    ];
    const db = database(cases.map(({ id, name }) => ({ ...france, id, name })));
    const logs = spyOn(console, 'log').mockImplementation(() => {});
    await migrateCountryMaps(db.prisma, true);
    expect(db.countries().map(({ id, name, code }) => ({ id, name, code }))).toEqual(cases);
    expect(logs.mock.calls.some(([message]) => String(message).startsWith('Fuzzy match:'))).toBe(false);
});

test('joined names across the entire catalog still identify the correct countries', async () => {
    const maps = catalog.countries.map(({ code, slug }) => ({
        ...france,
        id: `legacy-${code.toLowerCase()}`,
        name: slug.replaceAll('-', ''),
    }));
    const db = database(maps);
    spyOn(console, 'log').mockImplementation(() => {});
    const errors = spyOn(console, 'error').mockImplementation(() => {});
    await migrateCountryMaps(db.prisma, true);
    expect(db.countries().map(({ code }) => code)).toEqual(catalog.countries.map(({ code }) => code));
    expect(errors).not.toHaveBeenCalled();
    expect(db.maps()).toEqual([]);
});

test('--match prompts only for unresolved maps, retries invalid codes and keeps prompts outside the transaction', async () => {
    const unresolved = { ...france, id: 'unknown-country', name: 'Unknown country' };
    const fuzzy = { ...france, id: 'portgual', name: 'Portgual' };
    const maps = [france, unresolved, fuzzy];
    for (const apply of [false, true]) {
        const db = database(maps);
        const answers = ['ZZ', 'germany', '  de  '];
        const ask = spyOn(globalThis, 'prompt').mockImplementation(() => {
            expect(db.transactionStarted()).toBe(false);
            expect(db.writes).toEqual([]);
            return answers.shift() ?? null;
        });
        const errors = spyOn(console, 'error').mockImplementation(() => {});
        const logs = spyOn(console, 'log').mockImplementation(() => {});
        expect(await migrateCountryMaps(db.prisma, apply, true)).toEqual(maps.map(({ id }) => id));
        expect(ask).toHaveBeenCalledTimes(3);
        expect(ask).toHaveBeenCalledWith(expect.stringContaining('"unknown-country" (Unknown country)'), '');
        expect(errors).toHaveBeenCalledTimes(2);
        expect(logs).toHaveBeenCalledWith(expect.stringContaining('-> Germany (DE).'));
        expect(db.maps()).toEqual(apply ? [] : maps);
        expect(db.countries().map(({ code }) => code)).toEqual(apply ? ['FR', 'DE', 'PT'] : []);
        expect(db.countries()[1]?.id).toBe(apply ? unresolved.id : undefined);
        ask.mockRestore();
        errors.mockRestore();
        logs.mockRestore();
    }
});

test('--match allows explicit or blank skips and continues to later countries', async () => {
    for (const answer of ['', ' skip ']) {
        const unresolved = { ...france, id: 'unknown-country', name: 'Unknown country' };
        const db = database([unresolved, france]);
        const ask = spyOn(globalThis, 'prompt').mockReturnValue(answer);
        expect(await migrateCountryMaps(db.prisma, true, true)).toEqual([france.id]);
        expect(ask).toHaveBeenCalledWith(expect.any(String), '');
        expect(db.maps()).toEqual([unresolved]);
        expect(db.countries().map(({ code }) => code)).toEqual(['FR']);
    }
});

test('--match accepts manual choices for ambiguous automatic matches', async () => {
    const contradictory = { ...france, id: 'germany', name: 'France' };
    const db = database([contradictory]);
    spyOn(globalThis, 'prompt').mockReturnValue('FR');
    await migrateCountryMaps(db.prisma, true, true);
    expect(db.countries()[0]?.code).toBe('FR');
    expect(db.countries()[0]?.id).toBe('germany');
});

test('cancelling --match stops before the transaction or any writes', async () => {
    const unresolved = { ...france, id: 'unknown-country', name: 'Unknown country' };
    const db = database([france, unresolved]);
    spyOn(globalThis, 'prompt').mockReturnValue(null);
    await expect(migrateCountryMaps(db.prisma, true, true)).rejects.toThrow('Matching cancelled');
    expect(db.transactionStarted()).toBe(false);
    expect(db.writes).toEqual([]);
    expect(db.maps()).toEqual([france, unresolved]);
});

test('maps changed while answering --match are not migrated', async () => {
    const unresolved = { ...france, id: 'unknown-country', name: 'Unknown country' };
    const db = database([france, unresolved]);
    spyOn(globalThis, 'prompt').mockImplementation(() => {
        db.maps()[1]!.updatedAt = new Date('2025-01-01');
        return 'DE';
    });
    await expect(migrateCountryMaps(db.prisma, true, true)).rejects.toThrow('changed during matching');
    expect(db.writes).toEqual([]);
    expect(db.countries()).toEqual([]);
});

test('manual ISO choices cannot overwrite an existing country or reuse an automatically matched code', async () => {
    const migrated = database([france]);
    await migrateCountryMaps(migrated.prisma, true);
    const unresolved = { ...france, id: 'unknown-country', name: 'Unknown country' };
    for (const db of [database([unresolved], migrated.countries()), database([france, unresolved])]) {
        spyOn(globalThis, 'prompt').mockReturnValue('FR');
        await expect(migrateCountryMaps(db.prisma, true, true)).rejects.toThrow('already exists');
        expect(db.writes).toEqual([]);
    }
});

test('--match refuses non-interactive CLI runs before loading database configuration', () => {
    const result = Bun.spawnSync(
        [process.execPath, new URL('./migrate-countries.ts', import.meta.url).pathname, '--match'],
        {
            env: {},
            stdin: 'ignore',
        },
    );
    expect(result.exitCode).toBe(1);
    expect(result.stderr.toString()).toContain('--match requires an interactive terminal.');
    expect(result.stderr.toString()).not.toContain('Invalid environment variables');
});

test('duplicate country codes and invalid content still abort before any writes', async () => {
    for (const map of [
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

    const unmatched = { ...france, name: 'Unknown country' };
    const db = database([unmatched], [country]);
    await expect(migrateCountryMaps(db.prisma, true)).rejects.toThrow('already exists');
    expect(db.writes).toEqual([]);
    expect(db.maps()).toEqual([unmatched]);
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
