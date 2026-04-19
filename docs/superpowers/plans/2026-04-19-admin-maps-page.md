# Admin Maps Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Maps management page to the manager app with server-side search, category filtering, sorting, and a detail side sheet.

**Architecture:** New `admin.maps.list` contract + oRPC endpoint with Prisma queries. New `/maps` page in the manager app following the same DataTable pattern as Users and Spots. Sheet component for map details on row click.

**Tech Stack:** oRPC contracts (Zod), Prisma (PostgreSQL), Next.js App Router, TanStack Table + React Query, nuqs, shadcn/ui (`@krak/ui`)

---

## File Structure

### New files:
- `packages/contracts/src/schemas/admin.ts` — add admin map schemas (modify)
- `packages/contracts/src/contract.ts` — add admin.maps.list contract (modify)
- `apps/api/src/orpc/routers/admin.ts` — add listAdminMaps handler (modify)
- `apps/api/src/orpc/router.ts` — register admin maps route (modify)
- `packages/ui/src/index.ts` — export Sheet components (modify)
- `apps/manager/src/components/app-sidebar.tsx` — add Maps nav item (modify)
- `apps/manager/src/app/(dashboard)/maps/page.tsx` — maps list page (create)
- `apps/manager/src/app/(dashboard)/maps/columns.tsx` — column definitions (create)
- `apps/manager/src/app/(dashboard)/maps/map-detail-sheet.tsx` — side sheet component (create)

---

### Task 1: Add admin map schemas to contracts

**Files:**
- Modify: `packages/contracts/src/schemas/admin.ts`

- [ ] **Step 1: Add admin map schemas**

Append the following at the end of `packages/contracts/src/schemas/admin.ts`, after the clips section (after line 316):

```ts
// ============================================================================
// List maps
// ============================================================================

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

- [ ] **Step 2: Add admin.maps.list to the contract**

In `packages/contracts/src/contract.ts`, add the import for the new schemas. Change line 17 from:

```ts
} from './schemas/admin';
```

to:

```ts
    adminListMapsInput,
    adminListMapsOutput,
} from './schemas/admin';
```

(Add `adminListMapsInput` and `adminListMapsOutput` to the existing import block from `./schemas/admin`.)

Then add the maps section inside the `admin` block in the contract. After the `clips` block (after line 103), add:

```ts
        maps: {
            list: oc.input(adminListMapsInput).output(adminListMapsOutput),
        },
```

- [ ] **Step 3: Verify contracts build**

Run: `bun run build --filter=@krak/contracts`

Expected: Build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add packages/contracts/src/schemas/admin.ts packages/contracts/src/contract.ts
git commit -m "feat(contracts): add admin.maps.list contract with pagination, search, and category filter"
```

---

### Task 2: Add admin maps list endpoint

**Files:**
- Modify: `apps/api/src/orpc/routers/admin.ts`
- Modify: `apps/api/src/orpc/router.ts`

- [ ] **Step 1: Add listAdminMaps handler**

Append the following at the end of `apps/api/src/orpc/routers/admin.ts` (after the last handler):

```ts
// ============================================================================
// admin.maps.list — Paginated, sortable map listing for admin dashboard
// ============================================================================

export const listAdminMaps = os.admin.maps.list
    .use(authed)
    .use(admin)
    .handler(async ({ context, input }) => {
        const { page, perPage, sortBy, sortOrder, search, categories } = input;
        const skip = (page - 1) * perPage;

        const where: Prisma.MapWhereInput = {};

        if (search) {
            where.name = { contains: search, mode: 'insensitive' };
        }

        if (categories && categories.length > 0) {
            where.categories = { hasSome: categories };
        }

        const [maps, total] = await Promise.all([
            context.prisma.map.findMany({
                where,
                orderBy: { [sortBy]: sortOrder },
                skip,
                take: perPage,
                select: {
                    id: true,
                    name: true,
                    categories: true,
                    subtitle: true,
                    staging: true,
                    createdAt: true,
                    updatedAt: true,
                },
            }),
            context.prisma.map.count({ where }),
        ]);

        return {
            maps,
            total,
            page,
            perPage,
        };
    });
```

- [ ] **Step 2: Register in router**

In `apps/api/src/orpc/router.ts`, add `listAdminMaps` to the import from `./routers/admin` (line 10):

```ts
import {
    listUsers,
    getUserByUsername,
    overview,
    listSpots,
    updateSpotGeneralInfo,
    listMedia,
    listClips,
    listAdminMaps,
} from './routers/admin';
```

Then add the maps route inside the `admin` block. After the `clips` block (after line 74), add:

```ts
        maps: {
            list: listAdminMaps,
        },
```

- [ ] **Step 3: Verify API builds**

Run: `bun run build --filter=@krak/api`

Expected: Build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add apps/api/src/orpc/routers/admin.ts apps/api/src/orpc/router.ts
git commit -m "feat(api): add admin.maps.list endpoint with search, category filter, and pagination"
```

---

### Task 3: Export Sheet from @krak/ui

**Files:**
- Modify: `packages/ui/src/index.ts`

- [ ] **Step 1: Add Sheet exports**

Append the following at the end of `packages/ui/src/index.ts` (after line 97):

```ts
export {
    Sheet,
    SheetPortal,
    SheetOverlay,
    SheetTrigger,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetFooter,
    SheetTitle,
    SheetDescription,
} from './components/ui/sheet';
```

- [ ] **Step 2: Commit**

```bash
git add packages/ui/src/index.ts
git commit -m "feat(ui): export Sheet components from @krak/ui barrel"
```

---

### Task 4: Add Maps to sidebar navigation

**Files:**
- Modify: `apps/manager/src/components/app-sidebar.tsx`

- [ ] **Step 1: Add Map icon import and Maps nav item**

In `apps/manager/src/components/app-sidebar.tsx`, change the icon import on line 3 from:

```ts
import { LayoutDashboard, MapPin, Users } from 'lucide-react';
```

to:

```ts
import { LayoutDashboard, Map, MapPin, Users } from 'lucide-react';
```

Then add the Maps item to the `managementItems` array (after the Spots entry, line 42):

```ts
const managementItems = [
    {
        title: 'Users',
        href: '/users',
        icon: Users,
    },
    {
        title: 'Spots',
        href: '/spots',
        icon: MapPin,
    },
    {
        title: 'Maps',
        href: '/maps',
        icon: Map,
    },
];
```

- [ ] **Step 2: Commit**

```bash
git add apps/manager/src/components/app-sidebar.tsx
git commit -m "feat(manager): add Maps to sidebar navigation"
```

---

### Task 5: Create maps column definitions

**Files:**
- Create: `apps/manager/src/app/(dashboard)/maps/columns.tsx`

- [ ] **Step 1: Create columns.tsx**

Create file `apps/manager/src/app/(dashboard)/maps/columns.tsx` with the following content:

```tsx
'use client';

import { format } from 'date-fns';

import type { ContractOutputs } from '@krak/contracts';
import { Badge, DataTableColumnHeader } from '@krak/ui';

import type { ColumnDef } from '@tanstack/react-table';

export type AdminMap = ContractOutputs['admin']['maps']['list']['maps'][number];

const categoryLabels: Record<string, string> = {
    maps: 'Maps',
    video: 'Video',
    skater: 'Skaters',
    filmer: 'Filmers',
    photographer: 'Photographers',
    magazine: 'Magazines',
    skatepark: 'Skateparks',
    shop: 'Shops',
    years: 'Years',
    greatest: 'Greatest',
    members: 'Members',
    artist: 'Artists',
};

export const columns: ColumnDef<AdminMap>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
        enableSorting: false,
        cell: ({ row }) => (
            <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                    <span className="font-medium">{row.getValue('name')}</span>
                    {row.original.staging && (
                        <Badge variant="outline" className="text-xs">
                            Staging
                        </Badge>
                    )}
                </div>
                {row.original.subtitle && (
                    <span className="text-sm text-muted-foreground">{row.original.subtitle}</span>
                )}
            </div>
        ),
    },
    {
        accessorKey: 'categories',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Categories" />,
        enableSorting: false,
        cell: ({ row }) => {
            const categories = row.getValue('categories') as string[];
            return (
                <div className="flex flex-wrap gap-1">
                    {categories.map((cat) => (
                        <Badge key={cat} variant="secondary">
                            {categoryLabels[cat] ?? cat}
                        </Badge>
                    ))}
                </div>
            );
        },
    },
    {
        accessorKey: 'createdAt',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
        cell: ({ row }) => {
            const date = new Date(row.getValue('createdAt'));
            return <span className="text-muted-foreground">{format(date, 'PP')}</span>;
        },
    },
];
```

- [ ] **Step 2: Commit**

```bash
git add apps/manager/src/app/\(dashboard\)/maps/columns.tsx
git commit -m "feat(manager): add maps table column definitions"
```

---

### Task 6: Create map detail side sheet

**Files:**
- Create: `apps/manager/src/app/(dashboard)/maps/map-detail-sheet.tsx`

- [ ] **Step 1: Create map-detail-sheet.tsx**

Create file `apps/manager/src/app/(dashboard)/maps/map-detail-sheet.tsx` with the following content:

```tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

import { Badge, Separator, Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, Skeleton } from '@krak/ui';

import { orpc } from '@/lib/orpc';

const categoryLabels: Record<string, string> = {
    maps: 'Maps',
    video: 'Video',
    skater: 'Skaters',
    filmer: 'Filmers',
    photographer: 'Photographers',
    magazine: 'Magazines',
    skatepark: 'Skateparks',
    shop: 'Shops',
    years: 'Years',
    greatest: 'Greatest',
    members: 'Members',
    artist: 'Artists',
};

interface MapDetailSheetProps {
    mapId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function MapDetailSheet({ mapId, open, onOpenChange }: MapDetailSheetProps) {
    const { data: map, isLoading } = useQuery(
        orpc.maps.fetch.queryOptions({
            input: { id: mapId! },
            enabled: !!mapId,
        }),
    );

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="overflow-y-auto sm:max-w-lg">
                {isLoading ? (
                    <div className="flex flex-col gap-4 pt-4">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                    </div>
                ) : map ? (
                    <>
                        <SheetHeader>
                            <div className="flex items-center gap-2">
                                <SheetTitle>{map.name}</SheetTitle>
                                {map.staging && (
                                    <Badge variant="outline" className="text-xs">
                                        Staging
                                    </Badge>
                                )}
                            </div>
                            {map.subtitle && <SheetDescription>{map.subtitle}</SheetDescription>}
                        </SheetHeader>

                        <div className="flex flex-col gap-6 pt-6">
                            {/* Categories */}
                            <div className="flex flex-col gap-2">
                                <span className="text-sm font-medium">Categories</span>
                                <div className="flex flex-wrap gap-1">
                                    {map.categories.map((cat) => (
                                        <Badge key={cat} variant="secondary">
                                            {categoryLabels[cat] ?? cat}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            {/* Edito */}
                            <div className="flex flex-col gap-2">
                                <span className="text-sm font-medium">Edito</span>
                                <p className="text-sm text-muted-foreground">{map.edito || '—'}</p>
                            </div>

                            {/* About */}
                            <div className="flex flex-col gap-2">
                                <span className="text-sm font-medium">About</span>
                                <p className="text-sm text-muted-foreground">{map.about || '—'}</p>
                            </div>

                            <Separator />

                            {/* Videos */}
                            <div className="flex flex-col gap-2">
                                <span className="text-sm font-medium">Videos</span>
                                {map.videos.length > 0 ? (
                                    <ul className="flex flex-col gap-1">
                                        {map.videos.map((url, i) => (
                                            <li key={i}>
                                                <a
                                                    href={url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-primary underline-offset-4 hover:underline"
                                                >
                                                    {url}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-muted-foreground">No videos</p>
                                )}
                            </div>

                            {/* Soundtrack */}
                            <div className="flex flex-col gap-2">
                                <span className="text-sm font-medium">Soundtrack</span>
                                {map.soundtrack.length > 0 ? (
                                    <ul className="flex flex-col gap-1">
                                        {map.soundtrack.map((track, i) => (
                                            <li key={i} className="text-sm text-muted-foreground">
                                                {track}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-muted-foreground">No soundtrack</p>
                                )}
                            </div>

                            <Separator />

                            {/* Dates */}
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">ID</span>
                                    <span className="text-sm font-mono text-muted-foreground">{map.id}</span>
                                </div>
                            </div>
                        </div>
                    </>
                ) : null}
            </SheetContent>
        </Sheet>
    );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/manager/src/app/\(dashboard\)/maps/map-detail-sheet.tsx
git commit -m "feat(manager): add map detail side sheet component"
```

---

### Task 7: Create maps list page

**Files:**
- Create: `apps/manager/src/app/(dashboard)/maps/page.tsx`

- [ ] **Step 1: Create page.tsx**

Create file `apps/manager/src/app/(dashboard)/maps/page.tsx` with the following content:

```tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { getCoreRowModel, useReactTable, type SortingState } from '@tanstack/react-table';
import { ChevronDown } from 'lucide-react';
import { parseAsArrayOf, parseAsInteger, parseAsString, parseAsStringLiteral, useQueryState } from 'nuqs';
import { useState } from 'react';

import {
    Button,
    DataTable,
    DataTablePagination,
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
    Input,
} from '@krak/ui';

import { SiteHeader } from '@/components/site-header';
import { orpc } from '@/lib/orpc';

import { columns } from './columns';
import { MapDetailSheet } from './map-detail-sheet';

const mapCategories = [
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
] as const;

type MapCategory = (typeof mapCategories)[number];

const categoryLabels: Record<string, string> = {
    maps: 'Maps',
    video: 'Video',
    skater: 'Skaters',
    filmer: 'Filmers',
    photographer: 'Photographers',
    magazine: 'Magazines',
    skatepark: 'Skateparks',
    shop: 'Shops',
    years: 'Years',
    greatest: 'Greatest',
    members: 'Members',
    artist: 'Artists',
};

export default function MapsPage() {
    const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
    const [search, setSearch] = useQueryState('search', parseAsString.withDefault('').withOptions({ throttleMs: 300 }));
    const [categories, setCategories] = useQueryState(
        'category',
        parseAsArrayOf(parseAsStringLiteral(mapCategories)),
    );
    const [sorting, setSorting] = useState<SortingState>([{ id: 'createdAt', desc: true }]);
    const [selectedMapId, setSelectedMapId] = useState<string | null>(null);

    const perPage = 20;

    const sortBy = (sorting[0]?.id as 'createdAt') ?? 'createdAt';
    const sortOrder = sorting[0]?.desc ? ('desc' as const) : ('asc' as const);

    const selectedCategories = categories ?? [];

    const { data, isLoading } = useQuery(
        orpc.admin.maps.list.queryOptions({
            input: {
                page,
                perPage,
                sortBy,
                sortOrder,
                search: search || undefined,
                categories: selectedCategories.length > 0 ? selectedCategories : undefined,
            },
        }),
    );

    const totalPages = data ? Math.ceil(data.total / perPage) : 0;

    const table = useReactTable({
        data: data?.maps ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualSorting: true,
        state: { sorting },
        onSortingChange: setSorting,
    });

    function handleSearchChange(value: string) {
        setSearch(value || null);
        setPage(1);
    }

    function toggleCategory(value: MapCategory) {
        const next = selectedCategories.includes(value)
            ? selectedCategories.filter((c) => c !== value)
            : [...selectedCategories, value];
        setCategories(next.length > 0 ? next : null);
        setPage(1);
    }

    function categoryFilterLabel(): string {
        if (selectedCategories.length === 0) return 'All categories';
        if (selectedCategories.length === 1) return categoryLabels[selectedCategories[0]] ?? selectedCategories[0];
        return `${selectedCategories.length} categories`;
    }

    return (
        <>
            <SiteHeader title="Maps" />
            <div className="flex flex-1 flex-col gap-6 px-6 pb-6 pt-4">
                <div className="flex items-center gap-3">
                    <Input
                        placeholder="Search by name..."
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="max-w-sm"
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-48 justify-between">
                                {categoryFilterLabel()}
                                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-48">
                            {mapCategories.map((cat) => (
                                <DropdownMenuCheckboxItem
                                    key={cat}
                                    checked={selectedCategories.includes(cat)}
                                    onCheckedChange={() => toggleCategory(cat)}
                                    onSelect={(e) => e.preventDefault()}
                                >
                                    {categoryLabels[cat]}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <DataTable
                    columns={columns}
                    table={table}
                    loading={isLoading}
                    skeletonRows={perPage}
                    onRowClick={(row) => setSelectedMapId(row.original.id)}
                >
                    {data && (
                        <DataTablePagination
                            page={page}
                            totalPages={totalPages}
                            total={data.total}
                            perPage={perPage}
                            onPageChange={setPage}
                        />
                    )}
                </DataTable>
            </div>

            <MapDetailSheet
                mapId={selectedMapId}
                open={!!selectedMapId}
                onOpenChange={(open) => {
                    if (!open) setSelectedMapId(null);
                }}
            />
        </>
    );
}
```

- [ ] **Step 2: Verify manager builds**

Run: `bun run build --filter=@krak/manager`

Expected: Build succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add apps/manager/src/app/\(dashboard\)/maps/page.tsx
git commit -m "feat(manager): add maps list page with search, category filter, and detail sheet"
```

---

### Task 8: Final verification

- [ ] **Step 1: Full monorepo build**

Run: `bun run build`

Expected: All packages and apps build successfully.

- [ ] **Step 2: Lint check**

Run: `bun run lint`

Expected: No lint errors (warnings are acceptable).

- [ ] **Step 3: Fix any issues**

If there are build or lint errors, fix them and commit the fixes.
