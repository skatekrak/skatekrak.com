# Bundled country catalog

This is a trimmed, derived snapshot of [mledoze/countries](https://github.com/mledoze/countries), pinned to commit `fa4f62182d19ff4f8b325cde6387c9cd9d80955a`. Country metadata and the derived catalog are available under the [Open Database License 1.0](./countries.LICENSE.txt). Credit: mledoze and the countries dataset contributors. The source repository credits its GeoJSON outlines to [TM World Borders](https://thematicmapping.org/downloads/world_borders.php).

Download the complete derived database: [countries.json](./countries.json). The checked-in JSON is imported directly by the manager; builds and page loads never fetch upstream data. It contains canonical slugs, English common names, two-letter country codes, representative latitude/longitude, and precomputed opening bounds. It does not inline flag SVGs or country polygons. It includes territories and the upstream Kosovo code `XK`, which is not an officially assigned ISO 3166-1 code.

## Flag logos

The same pinned archive supplies 250 SVG flags. They are separate static assets in both apps at `/images/countries/<slug>.svg`, for example `/images/countries/france.svg`; only displayed flags are downloaded, not all flag artwork in the JavaScript bundle. The catalog stores a canonical `slug`, not an image URL. A small generated code-to-slug lookup lets legacy/custom country URL IDs keep their existing links and still show the correct flag.

Flags are **not covered by ODbL**. See the separate [flag notice](../images/countries/FLAGS-NOTICE.md) and upstream's [copyright-on-emblems reference](https://en.wikipedia.org/wiki/Wikipedia:Copyright_on_emblems). Existing uploaded country images are not deleted, but country logos now use the bundled flags, so the manager no longer offers a logo upload. Maps and cities are unchanged.

## Bounds

Bounds contain all coordinates in the supplied country outline, not necessarily every territory claimed by a country. In particular, France's supplied outline covers metropolitan France and Corsica; French Guiana has its own entry. Countries and island groups with distant components can have large opening views.

The generator uses the smallest longitude arc containing the outline. The eastern longitude may exceed 180° for dateline-crossing countries; for example, 190° means 170°W in the next world copy. Latitudes are clipped to the map's Mercator limit (±85.051129°). Polar outlines use the full longitude range. These are display bounds, not legal boundaries or authoritative country centers.

The upstream Kosovo outline is empty. Its bounds are precomputed from the Kosovo polygon in [datasets/geo-countries, commit ca3b7150caa5d3cc3fb108a87fc6e3d57bd97d99](https://github.com/datasets/geo-countries/blob/ca3b7150caa5d3cc3fb108a87fc6e3d57bd97d99/data/countries.geojson), derived from public-domain Natural Earth data and distributed under PDDL 1.0. That sourced fallback is recorded in the JSON and generator; it is not an estimate from the representative point.

## Regeneration

From `apps/manager`, run:

```sh
bun run bundle:countries
```

This regenerates the metadata, both apps' flag assets/notices, and `packages/utils/src/countryFlagSlugs.ts`. Then format changed files with the repository formatter and run `bun test`. To upgrade the data, explicitly change the pinned commit in `scripts/bundle-countries.ts`, review the upstream metadata/outlines, flag artwork and licenses, and update this notice. Neither builds nor deployments update the snapshot automatically. Existing country records are not rewritten when the catalog is regenerated or when their editor is opened; a manager must select an entry and save to apply new metadata/bounds. If a future revision renames/removes countries, review obsolete generated SVGs explicitly rather than deleting broad asset directories.
