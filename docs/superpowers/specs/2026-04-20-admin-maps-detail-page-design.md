# Admin Maps Detail Page — Design Spec

## Goal

Replace the side sheet on the Maps admin page with a full detail page at `/maps/[id]`. The detail page shows map info on the left (1/3) and a tabbed preview of related content on the right (2/3), reusing the same queries the web app uses to display a custom map.

## Scope

- Remove the `MapDetailSheet` side sheet component
- Change maps list row click to navigate to `/maps/[id]`
- New `/maps/[id]/page.tsx` detail page with a 1/3 + 2/3 layout
- Left panel: map info (read-only)
- Right panel: tabbed preview (Spots, Media, Videos, Soundtrack)
- Reuse existing public oRPC endpoints — no new API work

## Data Fetching

The detail page makes 3 queries (same as the web app):

| Query | oRPC call | When |
|-------|-----------|------|
| Map info | `orpc.maps.fetch({ id })` | Always |
| Spots | `orpc.spots.listByTags({ tags: [id], tagsFromMedia })` | Always (`tagsFromMedia` depends on map category) |
| Media | `orpc.media.list({ hashtag: id, limit: 20 })` | Always (cursor-paginated) |

The `tagsFromMedia` flag logic (same as web app):
- `false` when map categories include "Maps", "Skateparks", or "Shops" — spots are found by their direct `tags` array
- `true` for all other categories (Video, Skaters, Filmers, etc.) — spots are found via media hashtags

Videos and soundtrack come from the `maps.fetch` response directly (no extra query).

## Page Layout: `/maps/[id]`

```
+--SiteHeader "Maps / {name}"--+
|                               |
| +--Left (1/3)--+ +--Right (2/3)----------+ |
| |               | |                        | |
| | Map Info Card | | [Spots] [Media] [Videos] [Soundtrack] |
| |               | |                        | |
| | Name + Badge  | | Tab content area       | |
| | Subtitle      | |                        | |
| | Categories    | |                        | |
| | ---           | |                        | |
| | Edito         | |                        | |
| | About         | |                        | |
| | ---           | |                        | |
| | ID            | |                        | |
| | Created       | |                        | |
| | Updated       | |                        | |
| +---------------+ +------------------------+ |
+-----------------------------------------------+
```

### Left Panel — Map Info Card

A `<Card>` component containing read-only map details:

- Map name as card title + staging `<Badge variant="outline">` if `staging === true`
- Subtitle in muted text
- Categories as `<Badge variant="secondary">` with display labels
- `<Separator />`
- Edito text (or "—" if empty)
- About text (or "—" if empty)
- `<Separator />`
- ID in monospace
- Created date (formatted with `date-fns` `format(date, 'PP')`)
- Updated date

### Right Panel — Tabbed Preview

Uses `<Tabs>` / `<TabsList>` / `<TabsTrigger>` / `<TabsContent>` from `@krak/ui` (shadcn).

Tab labels include counts when data is loaded: "Spots (42)", "Media (15)", etc.

#### Spots Tab

Data: `orpc.spots.listByTags({ tags: [id], tagsFromMedia })`

Display: List of spot rows inside a `<Card>`. Each row shows:
- Spot name (font-medium)
- City + Country in muted text
- Type badge (`<Badge>`)
- Row is clickable, navigates to `/spots/{spotId}` in the manager

Empty state: "No spots linked to this map"

#### Media Tab

Data: `orpc.media.list({ hashtag: id, limit: 20, cursor })` — cursor-paginated infinite query

Display: Grid of media thumbnails (Cloudinary image URLs). Each item shows:
- Thumbnail image (small square, `object-cover`)
- Caption below (truncated)
- Added by username in muted text

"Load more" button when `hasNextPage` is true.

Empty state: "No media for this map"

#### Videos Tab

Data: `map.videos` array from `maps.fetch` response (no extra query)

Display: List of video URLs as clickable links (open in new tab). Simple list inside a card.

Empty state: "No videos"

#### Soundtrack Tab

Data: `map.soundtrack` array from `maps.fetch` response (no extra query)

Display: List of track names. Simple list inside a card.

Empty state: "No soundtrack"

## Changes to Existing Files

### Modify: `apps/manager/src/app/(dashboard)/maps/page.tsx`

- Remove `selectedMapId` state and `MapDetailSheet` component
- Change `onRowClick` from `setSelectedMapId(row.original.id)` to `router.push(\`/maps/${row.original.id}\`)`
- Add `useRouter` import

### Delete: `apps/manager/src/app/(dashboard)/maps/map-detail-sheet.tsx`

No longer needed.

## New Files

- `apps/manager/src/app/(dashboard)/maps/[id]/page.tsx` — Detail page (orchestrator: fetches map + spots + media, renders left/right layout)
- `apps/manager/src/app/(dashboard)/maps/[id]/map-info-card.tsx` — Left panel component
- `apps/manager/src/app/(dashboard)/maps/[id]/map-preview-tabs.tsx` — Right panel tabbed preview component

## Non-goals

- No map editing (read-only)
- No media carousel/modal
- No video embedding (just links)
- No spot detail inline (just links to `/spots/[id]`)
