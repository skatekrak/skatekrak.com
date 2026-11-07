# Migrate country maps

Apply the country Prisma migrations first, including `20261107020000_country_antimeridian_bounds`. Back up the target database before applying this job.

From `packages/jobs`:

```sh
# Preview only; no database or search writes
bun run job:migrate-countries

# Apply the migration and clean up the maps search index
bun run job:migrate-countries --apply

# Interactively resolve unmatched or ambiguous countries (still a dry run)
bun run job:migrate-countries --match

# Interactively resolve and apply
bun run job:migrate-countries --apply --match
```

The job uses this package's fnox configuration. It reads PostgreSQL maps whose `categories` array contains `countries`, including staging maps. It does not read the historical JSON or MongoDB, and does not require `MONGODB_URL`.

ISO codes and opening bounds come from the checked-in catalog at `apps/manager/public/data/countries.json`; there are no upstream downloads. Exact catalog slugs, English names and two-letter codes are matched against each map's ID and name first, ignoring case, accents and punctuation. Contradictory exact matches are never resolved by fuzzy matching.

If there is no exact match, a fuzzy fallback removes word separators, treats `&` as `and`, and compares the ID/name with catalog names using edit distance (including adjacent letter swaps). It accepts only a match with at least 80% similarity and a lead of at least 10 percentage points over the next country. Both input and candidate names must have at least five characters; ISO codes are never fuzzy-matched. This handles inputs such as `antiguaandbarbuda`, `Antigua & Barbuda`, `Portgual` and `Frnace`, while refusing close alternatives such as `Austrlia` (Austria/Australia). Each accepted fuzzy choice is logged with its catalog name, code and similarity in both dry runs and applied runs. Review the dry-run output before applying: fuzzy matches are heuristic, not guaranteed identities. Existing map IDs and names are still preserved, not renamed.

Unknown or ambiguous matches are logged as errors and skipped without failing the job; other matching countries still migrate. Skipped maps remain unchanged and are excluded from search cleanup. The summary includes the number skipped. For unresolved legacy names, use the [explicit metadata migration](../../../../apps/api/src/scripts/migrate-countries.md) instead.

With `--match`, each unresolved or ambiguous map prompts for a two-letter country code from the bundled catalog, or Enter/`skip` to leave it unchanged. Codes are case-insensitive; invalid codes prompt again. Exact and accepted fuzzy matches do not prompt. Manual choices are logged with their catalog name/code and use the same bounds and conflict validation as automatic matches. The bundled Kosovo code `XK` is accepted too.

`--match` requires an interactive terminal. Prompts finish before opening the write transaction, so waiting for an answer cannot time out or hold a database transaction open. Manually reviewed maps changed while answering cause a safe abort before writes. Cancelling input also aborts before writes. Choices are not saved between runs: a dry run does not persist manual mappings, so answer again when applying with `--apply --match`.

Existing IDs, names, subtitle, editorial, about, videos, soundtrack and timestamps are preserved. `staging` becomes `hidden`, so existing publication status is retained rather than hiding all migrated countries. Only successfully replaced country maps are deleted. No spots, associations, spot tags or uploaded images are changed. Countries use the bundled SVG flags, and legacy country links continue to use the same IDs.

All matched records are validated before writing. Creation and source deletion run in one serializable transaction; invalid content, existing country ID/code conflicts or write failures still roll back the entire batch. Existing countries are never overwritten or merged. Resolve any existing drafts that conflict before applying.

After the database commits, the job removes country IDs from the `prod_MAPS` Meilisearch index. Search cleanup cannot be part of the database transaction: if it fails, the job exits unsuccessfully but the countries remain migrated. Re-run with `--apply` to retry; existing country IDs are included even when their source maps are already gone. Successful reruns do not duplicate countries.

Do not run the old `packages/prisma` `migrate:maps` command afterward: it replaces the maps table from historical data and could recreate migrated maps.
