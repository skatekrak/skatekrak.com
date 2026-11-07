import { expect, test } from 'bun:test';
import { z } from 'zod';

import { createCountryInput } from '@krak/contracts';
import { countrySlug, getCountryFlagPath } from '@krak/utils';

import snapshot from '../public/data/countries.json';
import { computeCountryBounds, prepareFlagSvg } from './bundle-countries';

test('precomputes bounds from polygon coordinates, not the representative point', () => {
    expect(
        computeCountryBounds({
            type: 'Polygon',
            coordinates: [
                [
                    [10, 20],
                    [30, 20],
                    [30, 40],
                    [10, 20],
                ],
            ],
        }),
    ).toEqual([
        [10, 20],
        [30, 40],
    ]);
});

test('uses the shortest longitude interval across the dateline and includes every island', () => {
    expect(
        computeCountryBounds({
            type: 'MultiPolygon',
            coordinates: [
                [
                    [
                        [178, -20],
                        [179, -20],
                        [179, -18],
                        [178, -20],
                    ],
                ],
                [
                    [
                        [-179, -19],
                        [-178, -19],
                        [-178, -17],
                        [-179, -19],
                    ],
                ],
            ],
        }),
    ).toEqual([
        [178, -20],
        [182, -17],
    ]);
});

test('clips polar bounds to Mercator and rejects degenerate outlines', () => {
    expect(
        computeCountryBounds({
            type: 'Polygon',
            coordinates: [
                [
                    [-180, -90],
                    [0, -60],
                    [180, -90],
                    [-180, -90],
                ],
            ],
        }),
    ).toEqual([
        [-180, -85.051129],
        [180, -60],
    ]);
    expect(() =>
        computeCountryBounds({
            type: 'Polygon',
            coordinates: [
                [
                    [0, 0],
                    [0, 1],
                    [0, 2],
                    [0, 0],
                ],
            ],
        }),
    ).toThrow();
});

test('the pinned snapshot has 250 unique, validated countries and only the fields the manager needs', () => {
    const schema = createCountryInput.pick({ code: true, name: true, bounds: true }).extend({
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180),
        slug: z.string().regex(/^[a-z0-9-]+$/),
    });
    expect(snapshot.countries).toEqual(z.array(schema).parse(snapshot.countries));
    expect(snapshot.countries).toHaveLength(250);
    expect(new Set(snapshot.countries.map(({ code }) => code)).size).toBe(250);
    expect(snapshot.revision).toBe('fa4f62182d19ff4f8b325cde6387c9cd9d80955a');
    expect(Object.keys(snapshot.countries[0]!).toSorted()).toEqual([
        'bounds',
        'code',
        'latitude',
        'longitude',
        'name',
        'slug',
    ]);
    expect(JSON.stringify(snapshot).length).toBeLessThan(60000);
});

test('every country has a canonical slug and identical, standalone SVG flags in both apps', async () => {
    expect(new Set(snapshot.countries.map(({ slug }) => slug)).size).toBe(250);
    for (const country of snapshot.countries) {
        expect(country.slug).toBe(countrySlug(country.name));
        expect(getCountryFlagPath('legacy-id', country.code)).toBe(`/images/countries/${country.slug}.svg`);
        const manager = await Bun.file(
            new URL(`../public/images/countries/${country.slug}.svg`, import.meta.url),
        ).text();
        const web = await Bun.file(
            new URL(`../../web/public/images/countries/${country.slug}.svg`, import.meta.url),
        ).text();
        expect(manager).toBe(web);
        expect(prepareFlagSvg(manager)).toBe(manager);
        expect(manager).not.toContain('<!DOCTYPE');
    }
});

test('flag validation keeps SVG paths and local symbol references but rejects active/external content', () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"><use href="#star"/></svg>';
    expect(prepareFlagSvg(`<!DOCTYPE svg PUBLIC "SVG" "https://www.w3.org/svg.dtd">${svg}`)).toBe(svg);
    for (const invalid of [
        '<svg onload="alert(1)"/>',
        '<svg><script>alert(1)</script></svg>',
        '<svg><svg:script>alert(1)</svg:script></svg>',
        '<svg><foreignObject/></svg>',
        '<svg><use href="https://example.com/flag.svg#star"/></svg>',
        '<svg><style>@import "https://example.com/style.css";</style></svg>',
        '<!DOCTYPE svg [<!ENTITY x "bad">]><svg/>',
        '<?xml-stylesheet href="https://example.com/style.css"?><svg/>',
        'not an SVG',
    ])
        expect(() => prepareFlagSvg(invalid)).toThrow();
});

test('real dateline countries stay compact, France uses its supplied outline, and Kosovo uses a sourced fallback', () => {
    for (const [code, maxWidth] of [
        ['FJ', 10],
        ['NZ', 30],
        ['RU', 200],
        ['US', 200],
    ] as const) {
        const country = snapshot.countries.find((entry) => entry.code === code)!;
        expect(country.bounds[1]![0]! - country.bounds[0]![0]!).toBeLessThan(maxWidth);
        expect(country.bounds[1]![0]!).toBeGreaterThan(180);
    }
    expect(snapshot.countries.find(({ code }) => code === 'FR')?.bounds).toEqual([
        [-5.134723, 41.364166],
        [9.562222, 51.09111],
    ]);
    expect(snapshot.countries.find(({ code }) => code === 'XK')?.bounds).toEqual(snapshot.fallback.XK.bounds);
});
