# Migrate country maps

Apply the country Prisma migrations first, including `20261107020000_country_antimeridian_bounds`. Back up the target database before applying this job.

From `packages/jobs`:

```sh
# Preview only; no database or search writes
bun run job:migrate-countries

# Apply the migration and clean up the maps search index
bun run job:migrate-countries --apply
```

The job uses this package's fnox configuration. It reads PostgreSQL maps whose `categories` array contains `countries`, including staging maps. It does not read the historical JSON or MongoDB.

ISO codes and opening bounds come from the checked-in catalog at `apps/manager/public/data/countries.json`; there are no upstream downloads. Exact catalog slugs, English names and two-letter codes are matched against each map's ID and name, ignoring case, accents and punctuation. Unknown or contradictory matches stop the entire migration. For legacy names that do not match, use the [explicit metadata migration](../../../../apps/api/src/scripts/migrate-countries.md) instead; the job does not guess.

Existing IDs, names, subtitle, editorial, about, videos, soundtrack and timestamps are preserved. `staging` becomes `hidden`, so existing publication status is retained rather than hiding all migrated countries. Only successfully replaced country maps are deleted. No spots, associations, spot tags or uploaded images are changed. Countries use the bundled SVG flags, and legacy country links continue to use the same IDs.

All records are validated before writing. Creation and source deletion run in one serializable transaction; conflicts or write failures roll back the entire batch. Existing country IDs/codes are never overwritten or merged. Resolve any existing drafts that conflict before applying.

After the database commits, the job removes country IDs from the `prod_MAPS` Meilisearch index. Search cleanup cannot be part of the database transaction: if it fails, the job exits unsuccessfully but the countries remain migrated. Re-run with `--apply` to retry; existing country IDs are included even when their source maps are already gone. Successful reruns do not duplicate countries.

Do not run the old `packages/prisma` `migrate:maps` command afterward: it replaces the maps table from historical data and could recreate migrated maps.
