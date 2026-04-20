# Admin Maps Page — Design Spec

## Goal

Add a Maps management page to the manager app (`apps/manager`) at `/maps`, allowing admins to browse, search, filter, and inspect maps. Follows the exact same patterns as the existing Users and Spots pages.

## Scope

- New `admin.maps.list` oRPC contract and server-side endpoint with pagination, search, category filtering, and sorting
- New `/maps` page in the manager app with DataTable, search, multi-select category filter
- Side sheet (right-side `Sheet`) showing map details on row click
- Add "Maps" entry to the sidebar navigation

## Data Model Reference

PostgreSQL `maps` table (Prisma):

| Field      | Type        | Notes                                                                                                             |
| ---------- | ----------- | ----------------------------------------------------------------------------------------------------------------- |
| id         | String (PK) | Human-readable slug, e.g. "famous", "thps"                                                                        |
| name       | String      | Display name                                                                                                      |
| categories | String[]    | Raw slugs: maps, video, skater, filmer, photographer, magazine, skatepark, shop, years, greatest, members, artist |
| subtitle   | String      | Default ""                                                                                                        |
| edito      | String      | Editorial blurb                                                                                                   |
| about      | String      | Longer description                                                                                                |
| staging    | Boolean     | Default false, hides from public endpoints                                                                        |
| videos     | String[]    | Video URLs                                                                                                        |
| soundtrack | String[]    | Track names                                                                                                       |
| createdAt  | DateTime    | Auto-generated                                                                                                    |
| updatedAt  | DateTime    | Auto-updated                                                                                                      |

12 category values: `maps`, `video`, `skater`, `filmer`, `photographer`, `magazine`, `skatepark`, `shop`, `years`, `greatest`, `members`, `artist`.

## 1. API Contract & Endpoint

### Contract (packages/contracts)

Add to `packages/contracts/src/schemas/admin.ts`:

```ts
export const AdminMapCategorySchema = z.enum([
    'maps',
    'video',
    'skater',
    'filmer',
    'photographer',
    'magazine',
    'skatepark',
    'shop',
    'years',
    'greatest',
    'members',
    'artist',
]);

export const AdminMapSchema = z.object({
    id: z.string(),
    name: z.string(),
    categories: z.array(z.string()),
    subtitle: z.string().nullable(),
    staging: z.boolean(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const adminListMapsInput = z.object({
    page: z.number().int().min(1).default(1),
    perPage: z.number().int().min(1).max(100).default(20),
    sortBy: z.enum(['createdAt']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
    search: z.string().optional(),
    categories: z.array(AdminMapCategorySchema).optional(),
});

export const adminListMapsOutput = z.object({
    maps: z.array(AdminMapSchema),
    total: z.number(),
    page: z.number(),
    perPage: z.number(),
});
```

Add to `packages/contracts/src/contract.ts` inside `admin`:

```ts
maps: {
    list: oc.input(adminListMapsInput).output(adminListMapsOutput),
},
```

### Endpoint (apps/api)

New file `apps/api/src/orpc/routers/admin/maps.ts` implementing `listAdminMaps`:

- Uses `context.prisma.map.findMany()` with:
    - `where.name: { contains: search, mode: 'insensitive' }` when search is provided
    - `where.categories: { hasSome: categories }` when categories filter is provided
    - No staging filter — admin always sees all maps
- `orderBy: { [sortBy]: sortOrder }`
- `skip: (page - 1) * perPage`, `take: perPage`
- Separate `count()` query with the same `where` clause for total
- Categories returned as raw slugs (no display-name mapping — that's a frontend concern for the admin)
- Returns `{ maps, total, page, perPage }`

Register in `apps/api/src/orpc/router.ts` under `admin.maps.list`.

## 2. Manager Frontend

### Page: `/maps` (apps/manager/src/app/(dashboard)/maps/page.tsx)

Client component. Same structure as Users and Spots list pages.

**URL state (nuqs):**

- `page` — `parseAsInteger.withDefault(1)`
- `search` — `parseAsString.withDefault('').withOptions({ throttleMs: 300 })`
- `categories` — `parseAsArrayOf(parseAsStringLiteral([...12 categories]))`

**Local state:**

- `sorting` — `useState<SortingState>([{ id: 'createdAt', desc: true }])`
- `selectedMapId` — `useState<string | null>(null)` for the side sheet

**Data fetching:**

```ts
const { data, isLoading } = useQuery(
    orpc.admin.maps.list.queryOptions({
        input: { page, perPage, sortBy, sortOrder, search, categories },
    }),
);
```

**Filter bar layout:**

- Search `<Input>` (placeholder "Search maps...", max-w-sm)
- Category multi-select `<DropdownMenu>` with `<DropdownMenuCheckboxItem>` for each of the 12 categories (same pattern as spot type filter)

**Table:**

- `useReactTable` with `manualSorting: true`
- `<DataTable>` with `onRowClick` setting `selectedMapId` to the clicked map's ID
- `<DataTablePagination>` as children

**Side sheet:**

- `<MapDetailSheet mapId={selectedMapId} open={!!selectedMapId} onOpenChange={...} />`

### Columns: maps/columns.tsx

| Column key   | Header     | Sortable | Cell rendering                                                                                                                                                                                    |
| ------------ | ---------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`       | Name       | No       | Map name in font-medium. If `staging === true`, render a `<Badge variant="outline">Staging</Badge>` inline after the name. Subtitle rendered below in `text-muted-foreground text-sm` if present. |
| `categories` | Categories | No       | Array of `<Badge variant="secondary">` with display-friendly labels (capitalize first letter). Wrap with `flex flex-wrap gap-1`.                                                                  |
| `createdAt`  | Created At | Yes      | Formatted date using `toLocaleDateString()`. Uses `<DataTableColumnHeader>`.                                                                                                                      |

Type definition:

```ts
export type AdminMap = ContractOutputs['admin']['maps']['list']['maps'][number];
```

### Side Sheet: maps/map-detail-sheet.tsx

Uses `<Sheet>` from `@krak/ui` (shadcn), opens from the right.

Fetches full map data using existing `orpc.maps.fetch.queryOptions({ input: { id } })` when `mapId` is set.

Layout inside `<SheetContent>`:

- `<SheetHeader>`: Map name as title, subtitle as description
- Staging badge if `staging === true`
- Categories as badges
- Sections with labels:
    - **Edito**: Text content or "—" if empty
    - **About**: Text content or "—" if empty
    - **Videos**: List of URLs (or "No videos")
    - **Soundtrack**: List of track names (or "No soundtrack")
    - **Created**: Formatted date
    - **Updated**: Formatted date

Read-only — no editing capabilities in this iteration.

### Sidebar: Add Maps navigation item

In `apps/manager/src/components/app-sidebar.tsx`, add to the Management group:

```ts
{ title: 'Maps', href: '/maps', icon: Map }
```

Using the `Map` icon from `lucide-react`. Place it after Spots.

## 3. Files to Create/Modify

### New files:

- `apps/manager/src/app/(dashboard)/maps/page.tsx`
- `apps/manager/src/app/(dashboard)/maps/columns.tsx`
- `apps/manager/src/app/(dashboard)/maps/map-detail-sheet.tsx`
- `apps/api/src/orpc/routers/admin/maps.ts`

### Modified files:

- `packages/contracts/src/schemas/admin.ts` — Add map admin schemas
- `packages/contracts/src/contract.ts` — Add `admin.maps.list` contract
- `apps/api/src/orpc/router.ts` — Register admin maps route
- `apps/manager/src/components/app-sidebar.tsx` — Add Maps nav item

## 4. Non-goals

- No map editing/creation from the admin
- No spot list inside the side sheet
- No staging filter toggle (admin always sees all maps)
- No map detail page (side sheet only)
