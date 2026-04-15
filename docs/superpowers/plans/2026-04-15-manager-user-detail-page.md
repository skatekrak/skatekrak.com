# Manager User Detail Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a read-only user detail page at `/users/[username]` to the manager app, backed by a new `admin.users.getByUsername` oRPC endpoint.

**Architecture:** Contract-first — define Zod schemas and oRPC contract in `@krak/contracts`, implement the route handler in `apps/api`, then build the frontend page in `apps/manager`. The DataTable in `@krak/ui` gets an optional `onRowClick` prop to enable row navigation.

**Tech Stack:** oRPC + Zod v4, Prisma, Next.js 16 App Router, TanStack Query v5, `@krak/ui` (shadcn), Tailwind CSS v4

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `packages/contracts/src/schemas/admin.ts` | Modify | Add `SubscriptionStatusSchema`, `StanceSchema`, `AdminUserDetailSchema`, `AdminProfileSchema`, `AdminAccountSchema`, input/output schemas |
| `packages/contracts/src/contract.ts` | Modify | Add `admin.users.getByUsername` contract entry |
| `apps/api/src/orpc/routers/admin.ts` | Modify | Add `getUserByUsername` route handler |
| `apps/api/src/orpc/router.ts` | Modify | Register `getUserByUsername` in the router |
| `packages/ui/src/components/ui/data-table.tsx` | Modify | Add optional `onRowClick` prop |
| `apps/manager/src/app/(dashboard)/users/page.tsx` | Modify | Add row click navigation to `/users/{username}` |
| `apps/manager/src/app/(dashboard)/users/[username]/page.tsx` | Create | User detail page with three cards |

---

### Task 1: Add admin detail Zod schemas

**Files:**
- Modify: `packages/contracts/src/schemas/admin.ts`

- [ ] **Step 1: Add the new schemas to `admin.ts`**

Add the following after the existing `listUsersInput` schema at line 43 of `packages/contracts/src/schemas/admin.ts`. Import `CloudinaryFileSchema` and `StatSchema` from the shared schemas (they already exist in `./shared.ts`).

Replace the entire file with:

```ts
import { z } from 'zod';

import { CloudinaryFileSchema, StatSchema } from './shared';

// ============================================================================
// Enums
// ============================================================================

export const RoleSchema = z.enum(['USER', 'MODERATOR', 'ADMIN']);
export const SubscriptionStatusSchema = z.enum(['ACTIVE', 'EXPIRED', 'CANCELLED', 'NONE']);
export const StanceSchema = z.enum(['GOOFY', 'REGULAR']);

// ============================================================================
// List users (existing)
// ============================================================================

export const AdminUserSchema = z.object({
    id: z.string(),
    username: z.string(),
    displayUsername: z.string().nullable(),
    email: z.string().nullable(),
    role: RoleSchema,
    banned: z.boolean(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const listUsersOutput = z.object({
    users: z.array(AdminUserSchema),
    total: z.number(),
    page: z.number(),
    perPage: z.number(),
});

export const listUsersInput = z.object({
    page: z.number().int().min(1).default(1),
    perPage: z.number().int().min(1).max(100).default(20),
    sortBy: z.enum(['username', 'createdAt']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
    search: z.string().optional(),
    role: RoleSchema.optional(),
    banned: z.boolean().optional(),
});

// ============================================================================
// Get user by username (new)
// ============================================================================

export const AdminUserDetailSchema = z.object({
    id: z.string(),
    username: z.string(),
    displayUsername: z.string().nullable(),
    email: z.string().nullable(),
    emailVerified: z.boolean(),
    name: z.string().nullable(),
    image: z.string().nullable(),
    role: RoleSchema,
    banned: z.boolean(),
    banReason: z.string().nullable(),
    banExpires: z.coerce.date().nullable(),
    receiveNewsletter: z.boolean(),
    welcomeMailSent: z.boolean(),
    subscriptionStatus: SubscriptionStatusSchema,
    stripeCustomerId: z.string().nullable(),
    subscriptionEndAt: z.coerce.date().nullable(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const AdminProfileSchema = z.object({
    id: z.string(),
    description: z.string().nullable(),
    location: z.string().nullable(),
    stance: StanceSchema.nullable(),
    snapchat: z.string().nullable(),
    instagram: z.string().nullable(),
    website: z.string().nullable(),
    sponsors: z.array(z.string()),
    profilePicture: CloudinaryFileSchema.nullable(),
    banner: CloudinaryFileSchema.nullable(),
    followersStat: StatSchema.nullable(),
    followingStat: StatSchema.nullable(),
    spotsFollowingStat: StatSchema.nullable(),
    mediasStat: StatSchema.nullable(),
    clipsStat: StatSchema.nullable(),
    tricksDoneStat: StatSchema.nullable(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const AdminAccountSchema = z.object({
    id: z.string(),
    accountId: z.string(),
    providerId: z.string(),
    hasAccessToken: z.boolean(),
    hasRefreshToken: z.boolean(),
    accessTokenExpiresAt: z.coerce.date().nullable(),
    refreshTokenExpiresAt: z.coerce.date().nullable(),
    scope: z.string().nullable(),
    hasIdToken: z.boolean(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const getUserByUsernameInput = z.object({
    username: z.string(),
});

export const getUserByUsernameOutput = z.object({
    user: AdminUserDetailSchema,
    profile: AdminProfileSchema.nullable(),
    accounts: z.array(AdminAccountSchema),
});
```

- [ ] **Step 2: Verify the build**

Run: `bun run build --filter=@krak/contracts`
Expected: Build succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add packages/contracts/src/schemas/admin.ts
git commit -m "feat(contracts): add admin user detail schemas for getByUsername endpoint"
```

---

### Task 2: Add `admin.users.getByUsername` contract

**Files:**
- Modify: `packages/contracts/src/contract.ts`

- [ ] **Step 1: Update the contract import and add the new entry**

In `packages/contracts/src/contract.ts`, update the import from `./schemas/admin` (line 30) and add the contract entry.

Change line 30 from:
```ts
import { listUsersInput, listUsersOutput } from './schemas/admin';
```
to:
```ts
import { listUsersInput, listUsersOutput, getUserByUsernameInput, getUserByUsernameOutput } from './schemas/admin';
```

Then change the `admin` section (lines 74-78) from:
```ts
    admin: {
        users: {
            list: oc.input(listUsersInput).output(listUsersOutput),
        },
    },
```
to:
```ts
    admin: {
        users: {
            list: oc.input(listUsersInput).output(listUsersOutput),
            getByUsername: oc.input(getUserByUsernameInput).output(getUserByUsernameOutput),
        },
    },
```

- [ ] **Step 2: Verify the build**

Run: `bun run build --filter=@krak/contracts`
Expected: Build succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add packages/contracts/src/contract.ts
git commit -m "feat(contracts): add admin.users.getByUsername contract"
```

---

### Task 3: Add API route handler for `getByUsername`

**Files:**
- Modify: `apps/api/src/orpc/routers/admin.ts`
- Modify: `apps/api/src/orpc/router.ts`

- [ ] **Step 1: Add the route handler to `admin.ts`**

Add the following after the `listUsers` handler in `apps/api/src/orpc/routers/admin.ts`:

```ts
// ============================================================================
// admin.users.getByUsername — Full user detail with profile and accounts
// ============================================================================

export const getUserByUsername = os.admin.users.getByUsername
    .use(authed)
    .use(admin)
    .handler(async ({ context, input }) => {
        const user = await context.prisma.user.findUnique({
            where: { username: input.username },
            include: {
                profile: true,
                accounts: true,
            },
        });

        if (!user) {
            throw new ORPCError('NOT_FOUND', { message: `User '${input.username}' not found` });
        }

        return {
            user: {
                id: user.id,
                username: user.username,
                displayUsername: user.displayUsername,
                email: user.email,
                emailVerified: user.emailVerified,
                name: user.name,
                image: user.image,
                role: user.role,
                banned: user.banned,
                banReason: user.banReason,
                banExpires: user.banExpires,
                receiveNewsletter: user.receiveNewsletter,
                welcomeMailSent: user.welcomeMailSent,
                subscriptionStatus: user.subscriptionStatus,
                stripeCustomerId: user.stripeCustomerId,
                subscriptionEndAt: user.subscriptionEndAt,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
            profile: user.profile
                ? {
                      id: user.profile.id,
                      description: user.profile.description,
                      location: user.profile.location,
                      stance: user.profile.stance,
                      snapchat: user.profile.snapchat,
                      instagram: user.profile.instagram,
                      website: user.profile.website,
                      sponsors: user.profile.sponsors,
                      profilePicture: user.profile.profilePicture as any,
                      banner: user.profile.banner as any,
                      followersStat: user.profile.followersStat as any,
                      followingStat: user.profile.followingStat as any,
                      spotsFollowingStat: user.profile.spotsFollowingStat as any,
                      mediasStat: user.profile.mediasStat as any,
                      clipsStat: user.profile.clipsStat as any,
                      tricksDoneStat: user.profile.tricksDoneStat as any,
                      createdAt: user.profile.createdAt,
                      updatedAt: user.profile.updatedAt,
                  }
                : null,
            accounts: user.accounts.map((account) => ({
                id: account.id,
                accountId: account.accountId,
                providerId: account.providerId,
                hasAccessToken: account.accessToken != null,
                hasRefreshToken: account.refreshToken != null,
                accessTokenExpiresAt: account.accessTokenExpiresAt,
                refreshTokenExpiresAt: account.refreshTokenExpiresAt,
                scope: account.scope,
                hasIdToken: account.idToken != null,
                createdAt: account.createdAt,
                updatedAt: account.updatedAt,
            })),
        };
    });
```

Also add the `ORPCError` import at the top of `admin.ts`. Update line 2 from:
```ts
import { os, authed, admin } from '../base';
```
to:
```ts
import { ORPCError } from '@orpc/server';

import { os, authed, admin } from '../base';
```

- [ ] **Step 2: Register the handler in `router.ts`**

In `apps/api/src/orpc/router.ts`, update line 6:

From:
```ts
import { listUsers } from './routers/admin';
```
To:
```ts
import { listUsers, getUserByUsername } from './routers/admin';
```

Then update the admin section (lines 35-38):

From:
```ts
    admin: {
        users: {
            list: listUsers,
        },
    },
```
To:
```ts
    admin: {
        users: {
            list: listUsers,
            getByUsername: getUserByUsername,
        },
    },
```

- [ ] **Step 3: Verify the build**

Run: `bun run build --filter=@krak/api`
Expected: Build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add apps/api/src/orpc/routers/admin.ts apps/api/src/orpc/router.ts
git commit -m "feat(api): add admin.users.getByUsername route handler"
```

---

### Task 4: Add `onRowClick` prop to DataTable

**Files:**
- Modify: `packages/ui/src/components/ui/data-table.tsx`

- [ ] **Step 1: Add the `onRowClick` prop to DataTable**

Replace the full content of `packages/ui/src/components/ui/data-table.tsx` with:

```tsx
import { flexRender, type ColumnDef, type Row, type Table as ReactTable } from '@tanstack/react-table';

import { cn } from '@krak/ui/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@krak/ui/components/ui/table';
import { DataTableSkeleton } from '@krak/ui/components/ui/data-table-skeleton';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    table: ReactTable<TData>;
    loading?: boolean;
    skeletonRows?: number;
    stickyHeader?: boolean;
    onRowClick?: (row: Row<TData>) => void;
    children?: React.ReactNode;
}

export function DataTable<TData, TValue>({
    columns,
    table,
    loading = false,
    skeletonRows = 5,
    stickyHeader = false,
    onRowClick,
    children,
}: DataTableProps<TData, TValue>) {
    return (
        <div className="space-y-4">
            <div className={cn('overflow-hidden rounded-md border', stickyHeader && 'max-h-[calc(100vh-200px)] overflow-auto')}>
                {loading ? (
                    <DataTableSkeleton columnCount={columns.length} rowCount={skeletonRows} />
                ) : (
                    <Table>
                        <TableHeader className={cn(stickyHeader && 'sticky top-0 z-10 bg-background')}>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && 'selected'}
                                        className={cn('group', onRowClick && 'cursor-pointer')}
                                        onClick={onRowClick ? () => onRowClick(row) : undefined}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </div>
            {children}
        </div>
    );
}
```

Key changes:
- Import `Row` type from `@tanstack/react-table`
- Add `onRowClick?: (row: Row<TData>) => void` to props
- Add `cursor-pointer` class when `onRowClick` is provided
- Add `onClick` handler to `TableRow`

- [ ] **Step 2: Verify the build**

Run: `bun run build --filter=@krak/ui`
Expected: Build succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add packages/ui/src/components/ui/data-table.tsx
git commit -m "feat(ui): add onRowClick prop to DataTable component"
```

---

### Task 5: Make users table rows clickable

**Files:**
- Modify: `apps/manager/src/app/(dashboard)/users/page.tsx`

- [ ] **Step 1: Add row click navigation**

In `apps/manager/src/app/(dashboard)/users/page.tsx`, add the `useRouter` import and the `onRowClick` handler.

Add this import at the top (after `'use client'`):
```ts
import { useRouter } from 'next/navigation';
```

Inside the `UsersPage` component, after the `const perPage = 20;` line (line 34), add:
```ts
const router = useRouter();
```

Then update the `<DataTable>` usage (lines 121-126). Change:
```tsx
                <DataTable
                    columns={columns}
                    table={table}
                    loading={isLoading}
                    skeletonRows={perPage}
                >
```
to:
```tsx
                <DataTable
                    columns={columns}
                    table={table}
                    loading={isLoading}
                    skeletonRows={perPage}
                    onRowClick={(row) => router.push(`/users/${row.original.username}`)}
                >
```

- [ ] **Step 2: Verify the build**

Run: `bun run build --filter=@krak/manager`
Expected: Build succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add apps/manager/src/app/\(dashboard\)/users/page.tsx
git commit -m "feat(manager): make users table rows clickable with navigation to detail page"
```

---

### Task 6: Create user detail page

**Files:**
- Create: `apps/manager/src/app/(dashboard)/users/[username]/page.tsx`

- [ ] **Step 1: Create the page component**

Create `apps/manager/src/app/(dashboard)/users/[username]/page.tsx` with the following content:

```tsx
'use client';

import { use } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Globe, Instagram, Ghost, ExternalLink } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Badge,
    Avatar,
    AvatarFallback,
    AvatarImage,
    Separator,
    Skeleton,
    Button,
} from '@krak/ui';

import { orpc } from '@/lib/orpc';
import { SiteHeader } from '@/components/site-header';

// ============================================================================
// Helper components
// ============================================================================

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-sm">{label}</span>
            <span className="text-sm">{children}</span>
        </div>
    );
}

function DateField({ label, value }: { label: string; value: Date | null }) {
    if (!value) return <Field label={label}>-</Field>;
    return <Field label={label}>{new Date(value).toLocaleString()}</Field>;
}

function RoleBadge({ role }: { role: string }) {
    const variant = role === 'ADMIN' ? 'default' : role === 'MODERATOR' ? 'secondary' : 'outline';
    return <Badge variant={variant}>{role.toLowerCase()}</Badge>;
}

function BanStatus({ banned, reason, expires }: { banned: boolean; reason: string | null; expires: Date | null }) {
    if (!banned) {
        return <Badge variant="outline">active</Badge>;
    }
    return (
        <div className="flex flex-col gap-1">
            <Badge variant="destructive">banned</Badge>
            {reason && <span className="text-muted-foreground text-xs">{reason}</span>}
            {expires && (
                <span className="text-muted-foreground text-xs">Expires: {new Date(expires).toLocaleString()}</span>
            )}
        </div>
    );
}

function SubscriptionBadge({ status }: { status: string }) {
    const variant = status === 'ACTIVE' ? 'default' : status === 'NONE' ? 'outline' : 'secondary';
    return <Badge variant={variant}>{status.toLowerCase()}</Badge>;
}

function StatCell({ label, value }: { label: string; value: number | null | undefined }) {
    return (
        <div className="flex flex-col items-center gap-1 rounded-md border p-3">
            <span className="text-2xl font-semibold">{value ?? 0}</span>
            <span className="text-muted-foreground text-xs">{label}</span>
        </div>
    );
}

// ============================================================================
// Cards
// ============================================================================

function UserInfoCard({ user }: { user: any }) {
    const initials = (user.displayUsername || user.username).slice(0, 2).toUpperCase();

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        {user.image && <AvatarImage src={user.image} alt={user.username} />}
                        <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-xl">{user.displayUsername || user.username}</CardTitle>
                        <CardDescription>@{user.username}</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Email">
                        <span className="flex items-center gap-2">
                            {user.email ?? '-'}
                            {user.email && (
                                <Badge variant={user.emailVerified ? 'default' : 'outline'} className="text-xs">
                                    {user.emailVerified ? 'verified' : 'unverified'}
                                </Badge>
                            )}
                        </span>
                    </Field>
                    <Field label="Name">{user.name ?? '-'}</Field>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                    <Field label="Role">
                        <RoleBadge role={user.role} />
                    </Field>
                    <Field label="Status">
                        <BanStatus banned={user.banned} reason={user.banReason} expires={user.banExpires} />
                    </Field>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                    <Field label="Subscription">
                        <SubscriptionBadge status={user.subscriptionStatus} />
                    </Field>
                    <Field label="Stripe Customer ID">
                        {user.stripeCustomerId ? (
                            <code className="text-xs">{user.stripeCustomerId}</code>
                        ) : (
                            '-'
                        )}
                    </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Field label="Newsletter">
                        <Badge variant="outline">{user.receiveNewsletter ? 'subscribed' : 'not subscribed'}</Badge>
                    </Field>
                    <Field label="Welcome Mail">
                        <Badge variant="outline">{user.welcomeMailSent ? 'sent' : 'not sent'}</Badge>
                    </Field>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                    <DateField label="Created" value={user.createdAt} />
                    <DateField label="Updated" value={user.updatedAt} />
                </div>
            </CardContent>
        </Card>
    );
}

function AccountsCard({ accounts }: { accounts: any[] }) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <CardTitle>Accounts</CardTitle>
                    <Badge variant="secondary">{accounts.length}</Badge>
                </div>
            </CardHeader>
            <CardContent className="grid gap-4">
                {accounts.length === 0 && (
                    <p className="text-muted-foreground text-sm">No linked accounts.</p>
                )}
                {accounts.map((account, index) => (
                    <div key={account.id}>
                        {index > 0 && <Separator className="mb-4" />}
                        <div className="grid gap-3">
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Provider">
                                    <Badge variant="outline">
                                        {account.providerId}
                                    </Badge>
                                </Field>
                                <Field label="Account ID">
                                    <code className="text-xs">{account.accountId}</code>
                                </Field>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <Field label="Access Token">
                                    <Badge variant={account.hasAccessToken ? 'default' : 'outline'}>
                                        {account.hasAccessToken ? 'yes' : 'no'}
                                    </Badge>
                                </Field>
                                <Field label="Refresh Token">
                                    <Badge variant={account.hasRefreshToken ? 'default' : 'outline'}>
                                        {account.hasRefreshToken ? 'yes' : 'no'}
                                    </Badge>
                                </Field>
                                <Field label="ID Token">
                                    <Badge variant={account.hasIdToken ? 'default' : 'outline'}>
                                        {account.hasIdToken ? 'yes' : 'no'}
                                    </Badge>
                                </Field>
                            </div>
                            {(account.accessTokenExpiresAt || account.refreshTokenExpiresAt) && (
                                <div className="grid grid-cols-2 gap-4">
                                    <DateField label="Access Token Expires" value={account.accessTokenExpiresAt} />
                                    <DateField label="Refresh Token Expires" value={account.refreshTokenExpiresAt} />
                                </div>
                            )}
                            {account.scope && (
                                <Field label="Scope">
                                    <code className="text-xs">{account.scope}</code>
                                </Field>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                                <DateField label="Created" value={account.createdAt} />
                                <DateField label="Updated" value={account.updatedAt} />
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

function ProfileCard({ profile }: { profile: any | null }) {
    if (!profile) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm">No profile created.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
                {/* Banner */}
                {profile.banner?.url && (
                    <div className="overflow-hidden rounded-md">
                        <img
                            src={profile.banner.url}
                            alt="Banner"
                            className="h-32 w-full object-cover"
                        />
                    </div>
                )}

                {/* Profile Picture */}
                {profile.profilePicture?.url && (
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={profile.profilePicture.url} alt="Profile" />
                        <AvatarFallback>PP</AvatarFallback>
                    </Avatar>
                )}

                {/* Description */}
                {profile.description && (
                    <Field label="Description">
                        <span className="whitespace-pre-wrap">{profile.description}</span>
                    </Field>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <Field label="Location">{profile.location ?? '-'}</Field>
                    <Field label="Stance">
                        {profile.stance ? <Badge variant="outline">{profile.stance.toLowerCase()}</Badge> : '-'}
                    </Field>
                </div>

                <Separator />

                {/* Social Links */}
                <div className="grid gap-2">
                    <span className="text-muted-foreground text-sm">Social Links</span>
                    <div className="flex flex-wrap gap-2">
                        {profile.instagram && (
                            <a
                                href={`https://instagram.com/${profile.instagram}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm underline"
                            >
                                <Instagram className="h-4 w-4" />
                                {profile.instagram}
                                <ExternalLink className="h-3 w-3" />
                            </a>
                        )}
                        {profile.snapchat && (
                            <span className="inline-flex items-center gap-1 text-sm">
                                <Ghost className="h-4 w-4" />
                                {profile.snapchat}
                            </span>
                        )}
                        {profile.website && (
                            <a
                                href={profile.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm underline"
                            >
                                <Globe className="h-4 w-4" />
                                {profile.website}
                                <ExternalLink className="h-3 w-3" />
                            </a>
                        )}
                        {!profile.instagram && !profile.snapchat && !profile.website && (
                            <span className="text-muted-foreground text-sm">-</span>
                        )}
                    </div>
                </div>

                {/* Sponsors */}
                {profile.sponsors.length > 0 && (
                    <div className="grid gap-2">
                        <span className="text-muted-foreground text-sm">Sponsors</span>
                        <div className="flex flex-wrap gap-1">
                            {profile.sponsors.map((sponsor: string) => (
                                <Badge key={sponsor} variant="secondary">
                                    {sponsor}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                <Separator />

                {/* Stats Grid */}
                <div className="grid gap-2">
                    <span className="text-muted-foreground text-sm">Stats</span>
                    <div className="grid grid-cols-3 gap-2">
                        <StatCell label="Followers" value={profile.followersStat?.all} />
                        <StatCell label="Following" value={profile.followingStat?.all} />
                        <StatCell label="Spots" value={profile.spotsFollowingStat?.all} />
                        <StatCell label="Medias" value={profile.mediasStat?.all} />
                        <StatCell label="Clips" value={profile.clipsStat?.all} />
                        <StatCell label="Tricks" value={profile.tricksDoneStat?.all} />
                    </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                    <DateField label="Created" value={profile.createdAt} />
                    <DateField label="Updated" value={profile.updatedAt} />
                </div>
            </CardContent>
        </Card>
    );
}

// ============================================================================
// Loading skeleton
// ============================================================================

function UserDetailSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="flex flex-col gap-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-16 w-16 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-40" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Skeleton key={i} className="h-8 w-full" />
                        ))}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} className="h-8 w-full" />
                        ))}
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-24" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-32 w-full" />
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-8 w-full" />
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}

// ============================================================================
// Page component
// ============================================================================

export default function UserDetailPage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = use(params);

    const { data, isLoading, error } = useQuery(
        orpc.admin.users.getByUsername.queryOptions({
            input: { username },
        }),
    );

    if (error) {
        return (
            <>
                <SiteHeader title="User Not Found" />
                <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 pb-6 pt-4">
                    <p className="text-muted-foreground">
                        User <code>@{username}</code> was not found.
                    </p>
                    <Button variant="outline" asChild>
                        <Link href="/users">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Users
                        </Link>
                    </Button>
                </div>
            </>
        );
    }

    const displayName = data?.user.displayUsername || data?.user.username || username;

    return (
        <>
            <SiteHeader title={`User - @${displayName}`} />
            <div className="flex flex-1 flex-col gap-6 px-6 pb-6 pt-4">
                <div>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/users">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Users
                        </Link>
                    </Button>
                </div>

                {isLoading ? (
                    <UserDetailSkeleton />
                ) : data ? (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <div className="flex flex-col gap-6">
                            <UserInfoCard user={data.user} />
                            <AccountsCard accounts={data.accounts} />
                        </div>
                        <div>
                            <ProfileCard profile={data.profile} />
                        </div>
                    </div>
                ) : null}
            </div>
        </>
    );
}
```

- [ ] **Step 2: Verify the build**

Run: `bun run build --filter=@krak/manager`
Expected: Build succeeds with no errors.

- [ ] **Step 3: Commit**

```bash
git add apps/manager/src/app/\(dashboard\)/users/\[username\]/page.tsx
git commit -m "feat(manager): add user detail page at /users/[username]"
```

---

### Task 7: Smoke test the full flow

- [ ] **Step 1: Start the dev servers**

Run: `bun run dev:api` in one terminal and `bun run dev` in `apps/manager` in another (or use `bun run dev` at root).

- [ ] **Step 2: Manual verification**

1. Navigate to the manager app (port 3002)
2. Go to `/users` — verify the table renders
3. Click any user row — verify navigation to `/users/{username}`
4. Verify the three cards render with data:
   - User Info card: avatar, username, email, role badge, ban status, subscription, timestamps
   - Accounts card: provider info, token flags, timestamps
   - Profile card: picture, bio, social links, stats grid, timestamps (or "No profile created" placeholder)
5. Navigate to a non-existent username — verify the 404 error state renders
6. Click "Back to Users" — verify navigation back to `/users`

- [ ] **Step 3: Final commit (if any cleanup needed)**

```bash
git add -A
git commit -m "chore: cleanup after user detail page implementation"
```
