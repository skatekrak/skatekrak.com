import { z } from 'zod';

import { createCountryInput } from '@krak/contracts';

const revision = 'fa4f62182d19ff4f8b325cde6387c9cd9d80955a';
const source = `https://github.com/mledoze/countries/tree/${revision}`;
const positionSchema = z.tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)]);
const polygonSchema = z.array(z.array(positionSchema).min(4)).min(1);
const geometrySchema = z.discriminatedUnion('type', [
    z.object({ type: z.literal('Polygon'), coordinates: polygonSchema }),
    z.object({ type: z.literal('MultiPolygon'), coordinates: z.array(polygonSchema).min(1) }),
]);
const outlineSchema = z.object({
    type: z.literal('FeatureCollection'),
    features: z.array(z.object({ geometry: geometrySchema.nullish() })),
});
const countriesSchema = z
    .array(
        z.object({
            name: z.object({ common: z.string().min(1) }),
            cca2: z.string().regex(/^[A-Z]{2}$/),
            cca3: z.string().regex(/^[A-Z]{3}$/),
            latlng: z.tuple([z.number().min(-90).max(90), z.number().min(-180).max(180)]),
        }),
    )
    .min(200);

// mledoze's Kosovo outline is empty; use the pinned Natural Earth polygon's bounding box.
const fallback = {
    XK: {
        source: 'https://github.com/datasets/geo-countries/blob/ca3b7150caa5d3cc3fb108a87fc6e3d57bd97d99/data/countries.geojson',
        license: 'Public domain (Natural Earth) / PDDL-1.0',
        bounds: [
            [20.024751, 41.84401],
            [21.772758, 43.263071],
        ],
    },
};
const round = (value: number) => Number(value.toFixed(6));

export function computeCountryBounds(geometry: z.infer<typeof geometrySchema>) {
    const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
    const points = polygons.flat(2);
    const longitudes = [...new Set(points.map(([longitude]) => (longitude + 360) % 360))].toSorted((a, b) => a - b);
    if (longitudes.length < 2) throw new Error('Outline has no width');
    let south = 90;
    let north = -90;
    for (const [, latitude] of points) {
        south = Math.min(south, latitude);
        north = Math.max(north, latitude);
    }

    // The complement of the largest longitude gap is the smallest arc containing the country.
    let largestGap = -1;
    let start = 0;
    for (let index = 0; index < longitudes.length; index++) {
        const next = longitudes[(index + 1) % longitudes.length]!;
        const gap = next + (index === longitudes.length - 1 ? 360 : 0) - longitudes[index]!;
        if (gap > largestGap) {
            largestGap = gap;
            start = next;
        }
    }
    const west = south === -90 || north === 90 ? -180 : start > 180 ? start - 360 : start;
    const east = south === -90 || north === 90 ? 180 : west + 360 - largestGap;
    return createCountryInput.shape.bounds.parse([
        [round(west), round(Math.max(-85.051129, south))],
        [round(east), round(Math.min(85.051129, north))],
    ]);
}

async function main() {
    const response = await fetch(`https://codeload.github.com/mledoze/countries/tar.gz/${revision}`, {
        signal: AbortSignal.timeout(60000),
    });
    if (!response.ok) throw new Error(`Country download failed: ${response.status}`);
    const files = await new Bun.Archive(Bun.gunzipSync(new Uint8Array(await response.arrayBuffer()))).files();
    const base = `countries-${revision}/`;
    const dataFile = files.get(`${base}countries.json`);
    const license = files.get(`${base}LICENSE`);
    if (!dataFile || !license) throw new Error('Upstream archive is missing country data or its license');

    const countries = await Promise.all(
        countriesSchema.parse(await dataFile.json()).map(async (country) => {
            const file = files.get(`${base}data/${country.cca3.toLowerCase()}.geo.json`);
            if (!file) throw new Error(`Missing outline: ${country.cca2}`);
            const outline = outlineSchema.parse(await file.json());
            const geometries = outline.features.flatMap(({ geometry }) => (geometry ? [geometry] : []));
            const bounds = geometries.length
                ? computeCountryBounds({
                      type: 'MultiPolygon',
                      coordinates: geometries.flatMap((geometry) =>
                          geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates,
                      ),
                  })
                : country.cca2 === 'XK'
                  ? createCountryInput.shape.bounds.parse(fallback.XK.bounds)
                  : null;
            if (!bounds) throw new Error(`Empty outline without a sourced fallback: ${country.cca2}`);
            return {
                code: country.cca2,
                name: country.name.common,
                latitude: country.latlng[0],
                longitude: country.latlng[1],
                bounds,
            };
        }),
    );
    countries.sort((a, b) => a.name.localeCompare(b.name, 'en'));
    if (new Set(countries.map(({ code }) => code)).size !== countries.length)
        throw new Error('Duplicate country codes');

    const snapshot = { source, revision, license: 'ODbL-1.0', fallback, countries };
    const json = JSON.stringify(snapshot, null, 4) + '\n';
    await Bun.write(new URL('../public/data/countries.json', import.meta.url), json);
    await Bun.write(new URL('../public/data/countries.LICENSE.txt', import.meta.url), license);
    console.log(
        `Bundled ${countries.length} countries: ${json.length} bytes, ${Bun.gzipSync(json).length} bytes gzipped. No runtime download is needed.`,
    );
}

if (import.meta.main) {
    main().catch((error) => {
        console.error('Country bundling failed:', error);
        process.exitCode = 1;
    });
}
