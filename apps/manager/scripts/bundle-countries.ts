import { z } from 'zod';

import { createCountryInput } from '@krak/contracts';
import { countrySlug } from '@krak/utils';

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

export function prepareFlagSvg(svg: string) {
    const markup = svg.replace(/<!--[\s\S]*?-->/g, '');
    if (
        !/<svg\b/i.test(markup) ||
        svg.length > 1024 * 1024 ||
        /<(?:[\w.-]+:)?(?:script|foreignObject|iframe|object|embed|image|animate\w*|set)\b|\son[a-z][\w:-]*\s*=|<!ENTITY|<!DOCTYPE[^>]*\[|(?:xlink:)?href\s*=\s*["'](?!#)|url\(\s*["']?(?!#)[^)]*\)|@import|<\?(?!xml(?:\s|\?))/i.test(
            markup,
        )
    )
        throw new Error('Flag must be a static, self-contained SVG');
    return svg.replace(/<!DOCTYPE[^>]*>/gi, '');
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

    const flags = new Map<string, string>();
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
            const slug = countrySlug(country.name.common);
            const flagFile = files.get(`${base}data/${country.cca3.toLowerCase()}.svg`);
            if (!/^[a-z0-9-]+$/.test(slug) || !flagFile)
                throw new Error(`Missing flag or invalid slug: ${country.cca2}`);
            const svg = prepareFlagSvg(await flagFile.text());
            if (flags.has(slug)) throw new Error(`Duplicate country slug: ${slug}`);
            flags.set(slug, svg);
            return {
                code: country.cca2,
                slug,
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
    const flagsNotice = `# Country flag assets\n\nSVG flags come from [mledoze/countries](${source}/data), commit \`${revision}\`.\n\nFlags are explicitly excluded from the dataset's ODbL license. Upstream refers to [Wikipedia: Copyright on emblems](https://en.wikipedia.org/wiki/Wikipedia:Copyright_on_emblems); copyright and national-symbol usage restrictions can vary by artwork and jurisdiction. This bundle does not claim a single license or blanket public-domain status for all flag artwork.\n\nSVG comments and metadata are retained. External DOCTYPE declarations are removed, and the bundler rejects active content and non-local resource references. SVGs are served as separate images, never injected as HTML.\n\nFiles use canonical country slugs, for example \`france.svg\` or \`united-states.svg\`. These assets are identifying country flags, not newly created brand marks. Country metadata remains covered by ODbL 1.0; these flag assets do not.\n`;
    for (const app of ['manager', 'web']) {
        for (const [slug, svg] of flags) {
            await Bun.write(new URL(`../../${app}/public/images/countries/${slug}.svg`, import.meta.url), svg);
        }
        await Bun.write(new URL(`../../${app}/public/images/countries/FLAGS-NOTICE.md`, import.meta.url), flagsNotice);
    }
    const flagSlugs = Object.fromEntries(countries.map(({ code, slug }) => [code, slug]));
    await Bun.write(
        new URL('../../../packages/utils/src/countryFlagSlugs.ts', import.meta.url),
        '// Generated by apps/manager/scripts/bundle-countries.ts.\n' +
            `export const countryFlagSlugs: Readonly<Record<string, string>> = ${JSON.stringify(flagSlugs, null, 4)};\n`,
    );
    console.log(
        `Bundled ${countries.length} countries and SVG flags: ${json.length} metadata bytes, ${Bun.gzipSync(json).length} bytes gzipped. Flags are separate static assets, not in the JavaScript bundle.`,
    );
}

if (import.meta.main) {
    main().catch((error) => {
        console.error('Country bundling failed:', error);
        process.exitCode = 1;
    });
}
