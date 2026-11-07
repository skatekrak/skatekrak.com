# Move existing country maps to countries

Deploy the Prisma migration before deploying the API and frontends. Countries are managed at `/countries` in the manager and opened on the web with `/country/<slug>` (redirecting to `/?country=<slug>`). Legacy `/?id=<slug>` and `/map/<slug>` links also resolve to published countries.

The old maps have no ISO code or selected zone, so those values must be supplied explicitly. Bounds are two opposite corners, each in `[longitude, latitude]` order. Create a JSON array using the **existing map IDs**:

```json
[
    {
        "id": "france",
        "code": "FR",
        "bounds": [
            [-5.2, 41.3],
            [9.7, 51.2]
        ]
    }
]
```

From `apps/api`, preview and then apply:

```sh
bun run migrate:countries /absolute/path/countries.json
bun run migrate:countries /absolute/path/countries.json --apply
```

The script copies text, videos, soundtrack, timestamps and visibility (`staging` becomes `hidden`). It removes only the explicitly listed country maps, in the same serializable database transaction as their replacement. Errors roll back the entire batch; existing countries are never overwritten. Duplicate IDs and codes are rejected. Images stay at `assets/maps/custom-maps/<slug>.png`, and no spots or spot tags are changed.

After committing, it removes the old map search documents. If search cleanup fails, re-run the same command; already migrated countries are skipped and cleanup is retried. Countries are discoverable through the country selector and name/code matching against the public catalog in map search; there is no new search index.

Back up production before applying. Do not run the old `migrate:maps` script afterward: it replaces the whole maps table from the historical JSON and could recreate migrated maps.

The `20261107000000_country_bounds` schema migration converts any countries already using the earlier center/zoom format to approximate zones using a 1024×768 reference viewport. Editorial content and visibility are unchanged. Review those zones in the manager afterward; new selections are fitted to the available screen size instead of storing a fixed zoom.
