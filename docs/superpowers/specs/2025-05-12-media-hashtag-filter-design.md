# Media Hashtag Filter — Design Spec

## Goal

Add a hashtag filter to the admin media list in the manager app. Users can type hashtags into a free-text input, and the list filters to show only media that contain **all** specified hashtags (AND logic). Applies to both `/media` and `/spots/[id]/media` pages.

## Context

- Media hashtags are stored as `String[]` on the `Media` Prisma model (e.g. `["#lyon", "#ledge"]`), extracted from captions via regex on create/update.
- The public `media.list` endpoint already supports a single-hashtag filter using `{ hashtags: { has: tag } }`.
- The admin `admin.media.list` endpoint currently has no hashtag filter.
- The existing `addHashtagIfNeeded` helper in `apps/api/src/helpers/hashtags.ts` auto-prefixes `#`.

## Changes

### 1. Contract — `packages/contracts/src/schemas/admin.ts`

Add `hashtags` to `adminListMediaInput`:

```ts
hashtags: z.array(z.string()).optional(),
```

No changes to the output schema (`AdminMediaSchema`) — hashtags are not displayed in the list view.

### 2. API handler — `apps/api/src/orpc/routers/admin.ts`

In the `listMedia` handler, after existing filter logic, add:

```ts
if (input.hashtags && input.hashtags.length > 0) {
    where.hashtags = { hasEvery: input.hashtags.map(addHashtagIfNeeded) };
}
```

Import `addHashtagIfNeeded` from `../../helpers/hashtags`.

### 3. Manager UI — `apps/manager`

#### URL state (nuqs)

New query parameter on both media pages:

```ts
const [hashtags, setHashtags] = useQueryState(
    'hashtags',
    parseAsArrayOf(parseAsString).withDefault([]),
);
```

#### Filter input

A text input placed next to the existing Type filter dropdown:
- User types a hashtag and presses Enter.
- The tag is added to the `hashtags` array (auto-prefixed with `#` if missing).
- Duplicates are ignored.
- Each active tag renders as a badge with an X button to remove it.
- Adding or removing a tag resets page to 1.
- Uses `@krak/ui` primitives (`Input`, `Badge`).

#### Data fetching

Pass `hashtags` to the query input when non-empty:

```ts
orpc.admin.media.list.queryOptions({
    input: {
        page,
        perPage: 24,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        type: typeFilter || undefined,
        releaseStatus,
        spotId,
        hashtags: hashtags.length > 0 ? hashtags : undefined,
    },
})
```

### 4. Affected files

| File | Change |
|------|--------|
| `packages/contracts/src/schemas/admin.ts` | Add `hashtags` to `adminListMediaInput` |
| `apps/api/src/orpc/routers/admin.ts` | Add `hasEvery` filter in `listMedia` handler |
| `apps/manager/src/app/(dashboard)/media/page.tsx` | Add hashtag input, nuqs state, pass to query |
| `apps/manager/src/app/(dashboard)/spots/[id]/media/page.tsx` | Same changes as main media page |

## Out of scope

- Autocomplete/suggestions for hashtags (can be added later with a dedicated endpoint).
- Displaying hashtags on media cards.
- Hashtag management (add/remove hashtags from media in bulk).
