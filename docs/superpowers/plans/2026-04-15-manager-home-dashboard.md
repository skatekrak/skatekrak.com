# Manager Home Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a home dashboard to `apps/manager` showing platform stats (total users, spots, media, clips) and latest activity (recent users, spots, media).

**Architecture:** Hybrid API approach -- one lightweight `admin.overview` endpoint for aggregate counts, plus paginated `admin.spots.list` and `admin.media.list` endpoints (reusing existing `admin.users.list` for latest users). Frontend is a single dashboard page at `/` within the `(dashboard)` route group, using `@krak/ui` Card/Badge/Avatar/Skeleton components.

**Tech Stack:** oRPC contracts (Zod), Prisma (PostgreSQL), Next.js 16 App Router, TanStack Query, Tailwind CSS v4, `@krak/ui` (shadcn-based).

---

## File Structure

### New files
- `apps/manager/src/app/(dashboard)/page.tsx` -- Dashboard home page

### Modified files
- `packages/contracts/src/schemas/admin.ts` -- New Zod schemas for overview, spots, media
- `packages/contracts/src/contract.ts` -- New contract entries under `admin`
- `apps/api/src/orpc/routers/admin.ts` -- New handler implementations
- `apps/api/src/orpc/router.ts` -- Wire new handlers into router
- `apps/manager/src/app/page.tsx` -- Replace redirect with dashboard route
- `apps/manager/src/components/app-sidebar.tsx` -- Add Home nav item

---

### Task 1: Add admin schemas to `@krak/contracts`

**Files:**
- Modify: `packages/contracts/src/schemas/admin.ts`

- [ ] **Step 1: Add overview, spot, and media schemas**

Append the following after line 133 in `packages/contracts/src/schemas/admin.ts`:

```typescript
// ============================================================================
// Overview stats
// ============================================================================

export const adminOverviewOutput = z.object({
    totalUsers: z.number(),
    totalSpots: z.number(),
    totalMedia: z.number(),
    totalClips: z.number(),
});

// ============================================================================
// List spots
// ============================================================================

export const SpotTypeSchema = z.enum(['SHOP', 'STREET', 'PARK', 'DIY', 'PRIVATE']);
export const SpotStatusSchema = z.enum(['ACTIVE', 'WIP', 'RIP']);

export const AdminSpotSchema = z.object({
    id: z.string(),
    name: z.string(),
    city: z.string().nullable(),
    country: z.string().nullable(),
    type: SpotTypeSchema,
    status: SpotStatusSchema,
    addedBy: z
        .object({
            username: z.string(),
        })
        .nullable(),
    createdAt: z.coerce.date(),
});

export const adminListSpotsInput = z.object({
    page: z.number().int().min(1).default(1),
    perPage: z.number().int().min(1).max(100).default(20),
    sortBy: z.enum(['name', 'createdAt']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
    search: z.string().optional(),
});

export const adminListSpotsOutput = z.object({
    spots: z.array(AdminSpotSchema),
    total: z.number(),
    page: z.number(),
    perPage: z.number(),
});

// ============================================================================
// List media
// ============================================================================

export const MediaTypeSchema = z.enum(['IMAGE', 'VIDEO']);

const AdminCloudinaryFileSchemaMedia = z
    .object({
        publicId: z.string().nullable(),
        url: z.string(),
        width: z.number().nullable(),
        height: z.number().nullable(),
    })
    .nullable();

export const AdminMediaSchema = z.object({
    id: z.string(),
    type: MediaTypeSchema,
    caption: z.string().nullable(),
    image: AdminCloudinaryFileSchemaMedia,
    spot: z
        .object({
            id: z.string(),
            name: z.string(),
        })
        .nullable(),
    addedBy: z
        .object({
            username: z.string(),
        })
        .nullable(),
    createdAt: z.coerce.date(),
});

export const adminListMediaInput = z.object({
    page: z.number().int().min(1).default(1),
    perPage: z.number().int().min(1).max(100).default(20),
    sortBy: z.enum(['createdAt']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
    type: MediaTypeSchema.optional(),
});

export const adminListMediaOutput = z.object({
    media: z.array(AdminMediaSchema),
    total: z.number(),
    page: z.number(),
    perPage: z.number(),
});
```

- [ ] **Step 2: Verify the file compiles**

Run: `cd packages/contracts && bun run build`
Expected: Build succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add packages/contracts/src/schemas/admin.ts
git commit -m "feat(contracts): add admin overview, spots, and media schemas"
```

---

### Task 2: Add new contract entries

**Files:**
- Modify: `packages/contracts/src/contract.ts`

- [ ] **Step 1: Update the imports**

In `packages/contracts/src/contract.ts`, change line 4 from:

```typescript
import { listUsersInput, listUsersOutput, getUserByUsernameInput, getUserByUsernameOutput } from './schemas/admin';
```

to:

```typescript
import {
    listUsersInput,
    listUsersOutput,
    getUserByUsernameInput,
    getUserByUsernameOutput,
    adminOverviewOutput,
    adminListSpotsInput,
    adminListSpotsOutput,
    adminListMediaInput,
    adminListMediaOutput,
} from './schemas/admin';
```

- [ ] **Step 2: Add new contract entries under `admin`**

In `packages/contracts/src/contract.ts`, replace the `admin` block (lines 74-79):

```typescript
    admin: {
        users: {
            list: oc.input(listUsersInput).output(listUsersOutput),
            getByUsername: oc.input(getUserByUsernameInput).output(getUserByUsernameOutput),
        },
    },
```

with:

```typescript
    admin: {
        overview: oc.output(adminOverviewOutput),
        users: {
            list: oc.input(listUsersInput).output(listUsersOutput),
            getByUsername: oc.input(getUserByUsernameInput).output(getUserByUsernameOutput),
        },
        spots: {
            list: oc.input(adminListSpotsInput).output(adminListSpotsOutput),
        },
        media: {
            list: oc.input(adminListMediaInput).output(adminListMediaOutput),
        },
    },
```

- [ ] **Step 3: Verify the contracts package builds**

Run: `cd packages/contracts && bun run build`
Expected: Build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add packages/contracts/src/contract.ts
git commit -m "feat(contracts): add admin overview, spots.list, media.list contract entries"
```

---

### Task 3: Implement API handlers

**Files:**
- Modify: `apps/api/src/orpc/routers/admin.ts`

- [ ] **Step 1: Add the overview handler**

Append the following after the `getUserByUsername` handler (after line 140) in `apps/api/src/orpc/routers/admin.ts`:

```typescript
// ============================================================================
// admin.overview — Aggregate platform counts
// ============================================================================

export const overview = os.admin.overview
    .use(authed)
    .use(admin)
    .handler(async ({ context }) => {
        const [totalUsers, totalSpots, totalMedia, totalClips] = await Promise.all([
            context.prisma.user.count(),
            context.prisma.spot.count(),
            context.prisma.media.count(),
            context.prisma.clip.count(),
        ]);

        return { totalUsers, totalSpots, totalMedia, totalClips };
    });
```

- [ ] **Step 2: Add the spots list handler**

Append the following after the overview handler:

```typescript
// ============================================================================
// admin.spots.list — Paginated, sortable spot listing for admin dashboard
// ============================================================================

export const listSpots = os.admin.spots.list
    .use(authed)
    .use(admin)
    .handler(async ({ context, input }) => {
        const { page, perPage, sortBy, sortOrder, search } = input;
        const skip = (page - 1) * perPage;

        const where: Prisma.SpotWhereInput = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { city: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [spots, total] = await Promise.all([
            context.prisma.spot.findMany({
                where,
                orderBy: { [sortBy]: sortOrder },
                skip,
                take: perPage,
                select: {
                    id: true,
                    name: true,
                    city: true,
                    country: true,
                    type: true,
                    status: true,
                    addedBy: {
                        select: {
                            user: {
                                select: { username: true },
                            },
                        },
                    },
                    createdAt: true,
                },
            }),
            context.prisma.spot.count({ where }),
        ]);

        return {
            spots: spots.map((spot) => ({
                id: spot.id,
                name: spot.name,
                city: spot.city,
                country: spot.country,
                type: spot.type,
                status: spot.status,
                addedBy: spot.addedBy ? { username: spot.addedBy.user.username } : null,
                createdAt: spot.createdAt,
            })),
            total,
            page,
            perPage,
        };
    });
```

- [ ] **Step 3: Add the media list handler**

Append the following after the spots list handler:

```typescript
// ============================================================================
// admin.media.list — Paginated, sortable media listing for admin dashboard
// ============================================================================

export const listMedia = os.admin.media.list
    .use(authed)
    .use(admin)
    .handler(async ({ context, input }) => {
        const { page, perPage, sortBy, sortOrder, type } = input;
        const skip = (page - 1) * perPage;

        const where: Prisma.MediaWhereInput = {};

        if (type) {
            where.type = type;
        }

        const [media, total] = await Promise.all([
            context.prisma.media.findMany({
                where,
                orderBy: { [sortBy]: sortOrder },
                skip,
                take: perPage,
                select: {
                    id: true,
                    type: true,
                    caption: true,
                    image: true,
                    spot: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    addedBy: {
                        select: {
                            user: {
                                select: { username: true },
                            },
                        },
                    },
                    createdAt: true,
                },
            }),
            context.prisma.media.count({ where }),
        ]);

        return {
            media: media.map((m) => ({
                id: m.id,
                type: m.type,
                caption: m.caption,
                image: m.image as any,
                spot: m.spot ? { id: m.spot.id, name: m.spot.name } : null,
                addedBy: m.addedBy ? { username: m.addedBy.user.username } : null,
                createdAt: m.createdAt,
            })),
            total,
            page,
            perPage,
        };
    });
```

- [ ] **Step 4: Commit**

```bash
git add apps/api/src/orpc/routers/admin.ts
git commit -m "feat(api): implement admin overview, spots.list, media.list handlers"
```

---

### Task 4: Wire new handlers into the API router

**Files:**
- Modify: `apps/api/src/orpc/router.ts`

- [ ] **Step 1: Update the import**

In `apps/api/src/orpc/router.ts`, change line 2 from:

```typescript
import { listUsers, getUserByUsername } from './routers/admin';
```

to:

```typescript
import { listUsers, getUserByUsername, overview, listSpots, listMedia } from './routers/admin';
```

- [ ] **Step 2: Update the admin section of the router**

In `apps/api/src/orpc/router.ts`, replace the `admin` block (lines 52-57):

```typescript
    admin: {
        users: {
            list: listUsers,
            getByUsername: getUserByUsername,
        },
    },
```

with:

```typescript
    admin: {
        overview,
        users: {
            list: listUsers,
            getByUsername: getUserByUsername,
        },
        spots: {
            list: listSpots,
        },
        media: {
            list: listMedia,
        },
    },
```

- [ ] **Step 3: Verify the API builds**

Run: `bun run build:api`
Expected: Build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add apps/api/src/orpc/router.ts
git commit -m "feat(api): wire admin overview, spots.list, media.list into router"
```

---

### Task 5: Update sidebar navigation

**Files:**
- Modify: `apps/manager/src/components/app-sidebar.tsx`

- [ ] **Step 1: Add Home nav item and restructure sidebar**

In `apps/manager/src/components/app-sidebar.tsx`, replace the `navItems` array (lines 24-30):

```typescript
const navItems = [
    {
        title: 'Users',
        href: '/users',
        icon: Users,
    },
];
```

with:

```typescript
const mainItems = [
    {
        title: 'Home',
        href: '/',
        icon: LayoutDashboard,
    },
];

const managementItems = [
    {
        title: 'Users',
        href: '/users',
        icon: Users,
    },
];
```

- [ ] **Step 2: Update the sidebar JSX to render both groups**

Replace the `<SidebarContent>` section (lines 43-60):

```tsx
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Management</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)}>
                                        <Link href={item.href}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
```

with:

```tsx
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {mainItems.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)}
                                    >
                                        <Link href={item.href}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Management</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {managementItems.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)}>
                                        <Link href={item.href}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
```

- [ ] **Step 3: Commit**

```bash
git add apps/manager/src/components/app-sidebar.tsx
git commit -m "feat(manager): add Home nav item to sidebar"
```

---

### Task 6: Replace root page redirect and create dashboard page

**Files:**
- Modify: `apps/manager/src/app/page.tsx`
- Create: `apps/manager/src/app/(dashboard)/page.tsx`

- [ ] **Step 1: Delete the root page to avoid route conflict**

Delete `apps/manager/src/app/page.tsx`. Since `(dashboard)` is a route group (parenthesized), the new `(dashboard)/page.tsx` will serve `/` directly. Having both `app/page.tsx` and `app/(dashboard)/page.tsx` would cause a Next.js route conflict.

- [ ] **Step 2: Create the dashboard page**

Create `apps/manager/src/app/(dashboard)/page.tsx`:

```tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { Film, Image, MapPin, Users } from 'lucide-react';

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
    Badge,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Skeleton,
} from '@krak/ui';

import { SiteHeader } from '@/components/site-header';
import { orpc } from '@/lib/orpc';

export default function DashboardPage() {
    const { data: overview, isLoading: overviewLoading } = useQuery(orpc.admin.overview.queryOptions());

    const { data: usersData, isLoading: usersLoading } = useQuery(
        orpc.admin.users.list.queryOptions({
            input: { page: 1, perPage: 5, sortBy: 'createdAt', sortOrder: 'desc' },
        }),
    );

    const { data: spotsData, isLoading: spotsLoading } = useQuery(
        orpc.admin.spots.list.queryOptions({
            input: { page: 1, perPage: 5, sortBy: 'createdAt', sortOrder: 'desc' },
        }),
    );

    const { data: mediaData, isLoading: mediaLoading } = useQuery(
        orpc.admin.media.list.queryOptions({
            input: { page: 1, perPage: 5, sortBy: 'createdAt', sortOrder: 'desc' },
        }),
    );

    return (
        <>
            <SiteHeader title="Dashboard" />
            <div className="flex flex-1 flex-col gap-6 px-6 pb-6 pt-4">
                {/* Stats row */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <StatCard title="Users" value={overview?.totalUsers} loading={overviewLoading} icon={Users} />
                    <StatCard title="Spots" value={overview?.totalSpots} loading={overviewLoading} icon={MapPin} />
                    <StatCard title="Media" value={overview?.totalMedia} loading={overviewLoading} icon={Image} />
                    <StatCard title="Clips" value={overview?.totalClips} loading={overviewLoading} icon={Film} />
                </div>

                {/* Latest sections */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    {/* Latest Users */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Latest Users</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            {usersLoading
                                ? Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)
                                : usersData?.users.map((user) => (
                                      <a
                                          key={user.id}
                                          href={`/users/${user.username}`}
                                          className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-muted"
                                      >
                                          <Avatar className="size-8">
                                              <AvatarFallback>{user.username[0]?.toUpperCase()}</AvatarFallback>
                                          </Avatar>
                                          <div className="flex flex-1 flex-col overflow-hidden">
                                              <span className="truncate text-sm font-medium">{user.username}</span>
                                              <span className="truncate text-xs text-muted-foreground">
                                                  {user.email}
                                              </span>
                                          </div>
                                          <span className="shrink-0 text-xs text-muted-foreground">
                                              {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                                          </span>
                                      </a>
                                  ))}
                        </CardContent>
                    </Card>

                    {/* Latest Spots */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Latest Spots</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            {spotsLoading
                                ? Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)
                                : spotsData?.spots.map((spot) => (
                                      <div key={spot.id} className="flex items-center gap-3 rounded-md p-2">
                                          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                                              <MapPin className="size-4 text-muted-foreground" />
                                          </div>
                                          <div className="flex flex-1 flex-col overflow-hidden">
                                              <span className="truncate text-sm font-medium">{spot.name}</span>
                                              <span className="truncate text-xs text-muted-foreground">
                                                  {[spot.city, spot.country].filter(Boolean).join(', ')}
                                              </span>
                                          </div>
                                          <div className="flex shrink-0 flex-col items-end gap-1">
                                              <Badge variant="outline" className="text-xs">
                                                  {spot.type}
                                              </Badge>
                                              <span className="text-xs text-muted-foreground">
                                                  {formatDistanceToNow(new Date(spot.createdAt), { addSuffix: true })}
                                              </span>
                                          </div>
                                      </div>
                                  ))}
                        </CardContent>
                    </Card>

                    {/* Latest Media */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Latest Media</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            {mediaLoading
                                ? Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)
                                : mediaData?.media.map((m) => (
                                      <div key={m.id} className="flex items-center gap-3 rounded-md p-2">
                                          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
                                              {m.type === 'VIDEO' ? (
                                                  <Film className="size-4 text-muted-foreground" />
                                              ) : (
                                                  <Image className="size-4 text-muted-foreground" />
                                              )}
                                          </div>
                                          <div className="flex flex-1 flex-col overflow-hidden">
                                              <span className="truncate text-sm font-medium">
                                                  {m.caption || 'No caption'}
                                              </span>
                                              <span className="truncate text-xs text-muted-foreground">
                                                  {m.spot?.name ?? 'No spot'}
                                                  {m.addedBy ? ` \u00b7 ${m.addedBy.username}` : ''}
                                              </span>
                                          </div>
                                          <div className="flex shrink-0 flex-col items-end gap-1">
                                              <Badge variant="outline" className="text-xs">
                                                  {m.type}
                                              </Badge>
                                              <span className="text-xs text-muted-foreground">
                                                  {formatDistanceToNow(new Date(m.createdAt), { addSuffix: true })}
                                              </span>
                                          </div>
                                      </div>
                                  ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

// ============================================================================
// Stat card component
// ============================================================================

function StatCard({
    title,
    value,
    loading,
    icon: Icon,
}: {
    title: string;
    value: number | undefined;
    loading: boolean;
    icon: React.FC<{ className?: string }>;
}) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {loading ? (
                    <Skeleton className="h-8 w-20" />
                ) : (
                    <div className="text-2xl font-bold">{value?.toLocaleString()}</div>
                )}
            </CardContent>
        </Card>
    );
}

// ============================================================================
// Row skeleton for latest sections
// ============================================================================

function RowSkeleton() {
    return (
        <div className="flex items-center gap-3 p-2">
            <Skeleton className="size-8 rounded-md" />
            <div className="flex flex-1 flex-col gap-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
            </div>
        </div>
    );
}
```

- [ ] **Step 3: Verify the manager app builds**

Run: `cd apps/manager && bun run build`
Expected: Build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(manager): add home dashboard page with stats and latest activity"
```
