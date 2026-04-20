# Admin Maps Detail Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the maps side sheet with a full detail page at `/maps/[id]` showing map info (1/3 left) and a tabbed preview of spots, media, videos, and soundtrack (2/3 right).

**Architecture:** New `/maps/[id]/page.tsx` orchestrator fetches map info, spots, and media using existing public oRPC endpoints. Two child components (`MapInfoCard`, `MapPreviewTabs`) render the split layout. The existing maps list page is modified to navigate to the detail page instead of opening a side sheet.

**Tech Stack:** Next.js App Router, oRPC + TanStack Query (useQuery, useInfiniteQuery), shadcn/ui (@krak/ui), date-fns

---

## File Structure

### Modified files:
- `apps/manager/src/app/(dashboard)/maps/page.tsx` — Remove sheet, add router navigation

### Deleted files:
- `apps/manager/src/app/(dashboard)/maps/map-detail-sheet.tsx` — No longer needed

### New files:
- `apps/manager/src/app/(dashboard)/maps/[id]/page.tsx` — Detail page orchestrator
- `apps/manager/src/app/(dashboard)/maps/[id]/map-info-card.tsx` — Left panel (map metadata)
- `apps/manager/src/app/(dashboard)/maps/[id]/map-preview-tabs.tsx` — Right panel (tabbed content preview)

---

### Task 1: Update maps list page to navigate instead of opening sheet

**Files:**
- Modify: `apps/manager/src/app/(dashboard)/maps/page.tsx`
- Delete: `apps/manager/src/app/(dashboard)/maps/map-detail-sheet.tsx`

- [ ] **Step 1: Remove sheet and add navigation**

In `apps/manager/src/app/(dashboard)/maps/page.tsx`, make these changes:

1. Add `useRouter` import from `next/navigation`
2. Remove the `MapDetailSheet` import (line 24)
3. Remove `selectedMapId` state (line 66)
4. Add `const router = useRouter();` at the top of the component
5. Change `onRowClick` from `setSelectedMapId(row.original.id)` to `router.push(\`/maps/${row.original.id}\`)`
6. Remove the `<MapDetailSheet>` JSX at the bottom

The full updated file should be:

```tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { getCoreRowModel, useReactTable, type SortingState } from '@tanstack/react-table';
import { ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
    const router = useRouter();
    const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
    const [search, setSearch] = useQueryState('search', parseAsString.withDefault('').withOptions({ throttleMs: 300 }));
    const [categories, setCategories] = useQueryState(
        'category',
        parseAsArrayOf(parseAsStringLiteral(mapCategories)),
    );
    const [sorting, setSorting] = useState<SortingState>([{ id: 'createdAt', desc: true }]);

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
                    onRowClick={(row) => router.push(`/maps/${row.original.id}`)}
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
        </>
    );
}
```

- [ ] **Step 2: Delete the side sheet file**

```bash
rm apps/manager/src/app/\(dashboard\)/maps/map-detail-sheet.tsx
```

- [ ] **Step 3: Commit**

```bash
git add apps/manager/src/app/\(dashboard\)/maps/page.tsx
git rm apps/manager/src/app/\(dashboard\)/maps/map-detail-sheet.tsx
git commit -m "refactor(manager): replace maps side sheet with navigation to detail page"
```

---

### Task 2: Create map info card component

**Files:**
- Create: `apps/manager/src/app/(dashboard)/maps/[id]/map-info-card.tsx`

- [ ] **Step 1: Create map-info-card.tsx**

Create file `apps/manager/src/app/(dashboard)/maps/[id]/map-info-card.tsx`:

```tsx
'use client';

import { format } from 'date-fns';

import type { ContractOutputs } from '@krak/contracts';
import { Badge, Card, CardContent, CardHeader, CardTitle, Separator } from '@krak/ui';

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

type MapData = ContractOutputs['maps']['fetch'];

interface MapInfoCardProps {
    map: MapData;
}

export function MapInfoCard({ map }: MapInfoCardProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <CardTitle>{map.name}</CardTitle>
                    {map.staging && (
                        <Badge variant="outline" className="text-xs">
                            Staging
                        </Badge>
                    )}
                </div>
                {map.subtitle && <p className="text-sm text-muted-foreground">{map.subtitle}</p>}
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
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
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">Edito</span>
                    <p className="text-sm text-muted-foreground">{map.edito || '\u2014'}</p>
                </div>

                {/* About */}
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">About</span>
                    <p className="text-sm text-muted-foreground">{map.about || '\u2014'}</p>
                </div>

                <Separator />

                {/* Metadata */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">ID</span>
                        <span className="font-mono text-sm text-muted-foreground">{map.id}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Created</span>
                        <span className="text-sm text-muted-foreground">
                            {format(new Date(map.createdAt), 'PP')}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Updated</span>
                        <span className="text-sm text-muted-foreground">
                            {format(new Date(map.updatedAt), 'PP')}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
```

Note: `MapSchema` includes `createdAt` and `updatedAt` but they're not in the contract's `MapSchema` output. The `maps.fetch` endpoint returns these from Prisma. If the types don't include them, we'll cast with `as any` or use the raw response. The `MapSchema` in `packages/contracts/src/schemas/maps.ts` does NOT include `createdAt`/`updatedAt`. We'll handle this gracefully — if the fields aren't in the response type, we'll omit the date display or use optional chaining.

Actually, looking at the `MapSchema` again: `{ id, name, categories, subtitle, edito, about, videos, staging, soundtrack }` — no `createdAt`/`updatedAt`. So we'll skip the date fields in the card since the API doesn't return them through this endpoint. We'll show ID, edito, about, categories instead.

Updated version without dates:

```tsx
'use client';

import type { ContractOutputs } from '@krak/contracts';
import { Badge, Card, CardContent, CardHeader, CardTitle, Separator } from '@krak/ui';

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

type MapData = ContractOutputs['maps']['fetch'];

interface MapInfoCardProps {
    map: MapData;
}

export function MapInfoCard({ map }: MapInfoCardProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <CardTitle>{map.name}</CardTitle>
                    {map.staging && (
                        <Badge variant="outline" className="text-xs">
                            Staging
                        </Badge>
                    )}
                </div>
                {map.subtitle && <p className="text-sm text-muted-foreground">{map.subtitle}</p>}
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
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
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">Edito</span>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{map.edito || '\u2014'}</p>
                </div>

                {/* About */}
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">About</span>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{map.about || '\u2014'}</p>
                </div>

                <Separator />

                {/* ID */}
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">ID</span>
                    <span className="font-mono text-sm text-muted-foreground">{map.id}</span>
                </div>
            </CardContent>
        </Card>
    );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/manager/src/app/\(dashboard\)/maps/\[id\]/map-info-card.tsx
git commit -m "feat(manager): add map info card component for detail page"
```

---

### Task 3: Create map preview tabs component

**Files:**
- Create: `apps/manager/src/app/(dashboard)/maps/[id]/map-preview-tabs.tsx`

- [ ] **Step 1: Create map-preview-tabs.tsx**

Create file `apps/manager/src/app/(dashboard)/maps/[id]/map-preview-tabs.tsx`:

```tsx
'use client';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import Link from 'next/link';

import type { ContractOutputs } from '@krak/contracts';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Skeleton, Tabs, TabsContent, TabsList, TabsTrigger } from '@krak/ui';

import { orpc } from '@/lib/orpc';

type MapData = ContractOutputs['maps']['fetch'];

const directTagCategories = ['Maps', 'Skateparks', 'Shops'];

interface MapPreviewTabsProps {
    map: MapData;
}

export function MapPreviewTabs({ map }: MapPreviewTabsProps) {
    const tagsFromMedia = useMemo(() => {
        if (map.categories.length === 0) return true;
        return !map.categories.some((cat) => directTagCategories.includes(cat));
    }, [map.categories]);

    const { data: spots, isLoading: spotsLoading } = useQuery(
        orpc.spots.listByTags.queryOptions({
            input: {
                tags: [map.id],
                tagsFromMedia,
            },
        }),
    );

    const {
        data: mediaPages,
        isLoading: mediaLoading,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery(
        orpc.media.list.infiniteOptions({
            input: (pageParam: Date | undefined) => ({
                hashtag: map.id,
                limit: 20,
                cursor: pageParam,
            }),
            initialPageParam: undefined as Date | undefined,
            getNextPageParam: (lastPage) => {
                if (lastPage.length < 20) return undefined;
                const lastElement = lastPage[lastPage.length - 1];
                return lastElement?.createdAt ?? undefined;
            },
        }),
    );

    const medias = mediaPages?.pages.flat() ?? [];
    const spotsCount = spots?.length ?? 0;
    const mediasCount = medias.length;

    return (
        <Tabs defaultValue="spots">
            <TabsList>
                <TabsTrigger value="spots">
                    Spots{!spotsLoading && ` (${spotsCount})`}
                </TabsTrigger>
                <TabsTrigger value="media">
                    Media{!mediaLoading && ` (${mediasCount})`}
                </TabsTrigger>
                <TabsTrigger value="videos">
                    Videos ({map.videos.length})
                </TabsTrigger>
                <TabsTrigger value="soundtrack">
                    Soundtrack ({map.soundtrack.length})
                </TabsTrigger>
            </TabsList>

            {/* Spots Tab */}
            <TabsContent value="spots">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Spots</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {spotsLoading ? (
                            <div className="flex flex-col gap-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Skeleton key={i} className="h-10 w-full" />
                                ))}
                            </div>
                        ) : spotsCount === 0 ? (
                            <p className="text-sm text-muted-foreground">No spots linked to this map</p>
                        ) : (
                            <div className="flex flex-col divide-y">
                                {spots!.map((spot) => (
                                    <Link
                                        key={spot.id}
                                        href={`/spots/${spot.id}`}
                                        className="flex items-center justify-between py-2 hover:bg-muted/50 -mx-2 px-2 rounded-sm"
                                    >
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-sm font-medium">{spot.name}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {[spot.location.city, spot.location.country]
                                                    .filter(Boolean)
                                                    .join(', ') || '\u2014'}
                                            </span>
                                        </div>
                                        <Badge variant="outline" className="text-xs">
                                            {spot.type.toLowerCase()}
                                        </Badge>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Media Tab */}
            <TabsContent value="media">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Media</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {mediaLoading ? (
                            <div className="grid grid-cols-3 gap-2">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <Skeleton key={i} className="aspect-square w-full" />
                                ))}
                            </div>
                        ) : mediasCount === 0 ? (
                            <p className="text-sm text-muted-foreground">No media for this map</p>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <div className="grid grid-cols-3 gap-2">
                                    {medias.map((media) => (
                                        <div key={media.id} className="flex flex-col gap-1">
                                            <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
                                                {media.image?.url ? (
                                                    <img
                                                        src={media.image.url}
                                                        alt={media.caption ?? ''}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                                                        {media.type}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="truncate text-xs text-muted-foreground">
                                                {media.addedBy.username}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                {hasNextPage && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => fetchNextPage()}
                                        disabled={isFetchingNextPage}
                                    >
                                        {isFetchingNextPage ? 'Loading...' : 'Load more'}
                                    </Button>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Videos Tab */}
            <TabsContent value="videos">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Videos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {map.videos.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No videos</p>
                        ) : (
                            <ul className="flex flex-col gap-2">
                                {map.videos.map((url, i) => (
                                    <li key={i}>
                                        <a
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-primary underline-offset-4 hover:underline break-all"
                                        >
                                            {url}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Soundtrack Tab */}
            <TabsContent value="soundtrack">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Soundtrack</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {map.soundtrack.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No soundtrack</p>
                        ) : (
                            <ul className="flex flex-col gap-1">
                                {map.soundtrack.map((track, i) => (
                                    <li key={i} className="text-sm text-muted-foreground">
                                        {track}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/manager/src/app/\(dashboard\)/maps/\[id\]/map-preview-tabs.tsx
git commit -m "feat(manager): add map preview tabs component with spots, media, videos, soundtrack"
```

---

### Task 4: Create map detail page

**Files:**
- Create: `apps/manager/src/app/(dashboard)/maps/[id]/page.tsx`

- [ ] **Step 1: Create page.tsx**

Create file `apps/manager/src/app/(dashboard)/maps/[id]/page.tsx`:

```tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

import { Skeleton } from '@krak/ui';

import { SiteHeader } from '@/components/site-header';
import { orpc } from '@/lib/orpc';

import { MapInfoCard } from './map-info-card';
import { MapPreviewTabs } from './map-preview-tabs';

export default function MapDetailPage() {
    const { id } = useParams<{ id: string }>();

    const { data: map, isLoading } = useQuery(
        orpc.maps.fetch.queryOptions({
            input: { id },
        }),
    );

    return (
        <>
            <SiteHeader title={isLoading ? 'Maps' : `Maps / ${map?.name ?? id}`} />
            <div className="flex flex-1 flex-col gap-6 px-6 pb-6 pt-4">
                {isLoading ? (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <Skeleton className="h-96" />
                        <div className="lg:col-span-2">
                            <Skeleton className="h-96" />
                        </div>
                    </div>
                ) : map ? (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div>
                            <MapInfoCard map={map} />
                        </div>
                        <div className="lg:col-span-2">
                            <MapPreviewTabs map={map} />
                        </div>
                    </div>
                ) : (
                    <p className="text-muted-foreground">Map not found</p>
                )}
            </div>
        </>
    );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `cd apps/manager && bunx tsc --noEmit 2>&1 | grep "maps/"`

Expected: No errors from maps files (pre-existing errors in other files are fine).

- [ ] **Step 3: Commit**

```bash
git add apps/manager/src/app/\(dashboard\)/maps/\[id\]/page.tsx
git commit -m "feat(manager): add map detail page with info card and preview tabs"
```

---

### Task 5: Final verification

- [ ] **Step 1: TypeScript check**

Run: `cd apps/manager && bunx tsc --noEmit 2>&1 | grep "maps/"`

Expected: Zero errors from maps files.

- [ ] **Step 2: Lint check**

Run: `bun run lint 2>&1 | grep "maps/\[id\]"`

Expected: Zero lint errors from our new files.

- [ ] **Step 3: Fix any issues**

If there are type or lint errors in our files, fix them and commit the fixes.
