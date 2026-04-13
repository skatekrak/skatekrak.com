# DataTable Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the minimal DataTable in `apps/manager` with a composable, reusable set of data table components in `@krak/ui`, powered by TanStack Table.

**Architecture:** Composable sub-components (DataTable, DataTablePagination, DataTableColumnHeader, DataTableRowActions, DataTableSkeleton) in `@krak/ui`. Consumer creates TanStack table instance and passes it in. Components compose via children slots.

**Tech Stack:** TanStack React Table v8, shadcn/ui primitives, Tailwind CSS, lucide-react icons

---

### Task 1: Add @tanstack/react-table dependency to @krak/ui

**Files:**
- Modify: `packages/ui/package.json`
- Modify: `packages/ui/tsdown.config.ts`

- [ ] **Step 1: Add @tanstack/react-table as peer + dev dependency**

In `packages/ui/package.json`, add to `peerDependencies`:

```json
"@tanstack/react-table": "^8.0.0"
```

And add to `devDependencies`:

```json
"@tanstack/react-table": "^8.21.3"
```

- [ ] **Step 2: Externalize @tanstack/react-table in tsdown config**

In `packages/ui/tsdown.config.ts`, add `@tanstack/react-table` to the `neverBundle` list so it's treated as an external dependency:

```ts
import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm'],
    dts: false,
    clean: true,
    deps: {
        neverBundle: ['react', 'react-dom', '@tanstack/react-table'],
        alwaysBundle: [/^@krak\/ui/],
    },
    banner: '"use client";',
});
```

- [ ] **Step 3: Install dependencies**

Run: `bun install`
Expected: Dependencies resolve successfully.

- [ ] **Step 4: Commit**

```bash
git add packages/ui/package.json packages/ui/tsdown.config.ts bun.lock
git commit -m "feat(ui): add @tanstack/react-table as peer dependency"
```

---

### Task 2: Create DataTableColumnHeader component

**Files:**
- Create: `packages/ui/src/components/ui/data-table-column-header.tsx`

This component has no internal dependencies on other new DataTable components, so it can be built first.

- [ ] **Step 1: Create the DataTableColumnHeader component**

Create `packages/ui/src/components/ui/data-table-column-header.tsx`:

```tsx
import type { Column } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';

import { cn } from '@krak/ui/lib/utils';
import { Button } from '@krak/ui/components/ui/button';

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
    column: Column<TData, TValue>;
    title: string;
}

export function DataTableColumnHeader<TData, TValue>({
    column,
    title,
    className,
}: DataTableColumnHeaderProps<TData, TValue>) {
    if (!column.getCanSort()) {
        return <div className={cn(className)}>{title}</div>;
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            className={cn('-ml-3 h-8 data-[state=open]:bg-accent', className)}
            onClick={() => column.toggleSorting()}
        >
            <span>{title}</span>
            {column.getIsSorted() === 'desc' ? (
                <ArrowDown className="ml-2 size-4" />
            ) : column.getIsSorted() === 'asc' ? (
                <ArrowUp className="ml-2 size-4" />
            ) : (
                <ChevronsUpDown className="ml-2 size-4" />
            )}
        </Button>
    );
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/ui/src/components/ui/data-table-column-header.tsx
git commit -m "feat(ui): add DataTableColumnHeader component"
```

---

### Task 3: Create DataTableRowActions component

**Files:**
- Create: `packages/ui/src/components/ui/data-table-row-actions.tsx`

- [ ] **Step 1: Create the DataTableRowActions component**

Create `packages/ui/src/components/ui/data-table-row-actions.tsx`:

```tsx
import { MoreHorizontal } from 'lucide-react';

import { Button } from '@krak/ui/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@krak/ui/components/ui/dropdown-menu';

interface DataTableRowActionsProps {
    children: React.ReactNode;
}

export function DataTableRowActions({ children }: DataTableRowActionsProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex size-8 p-0 data-[state=open]:bg-muted">
                    <MoreHorizontal className="size-4" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
                {children}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/ui/src/components/ui/data-table-row-actions.tsx
git commit -m "feat(ui): add DataTableRowActions component"
```

---

### Task 4: Create DataTableSkeleton component

**Files:**
- Create: `packages/ui/src/components/ui/data-table-skeleton.tsx`

- [ ] **Step 1: Create the DataTableSkeleton component**

Create `packages/ui/src/components/ui/data-table-skeleton.tsx`:

```tsx
import { Skeleton } from '@krak/ui/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@krak/ui/components/ui/table';

interface DataTableSkeletonProps {
    columnCount: number;
    rowCount?: number;
}

export function DataTableSkeleton({ columnCount, rowCount = 5 }: DataTableSkeletonProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {Array.from({ length: columnCount }).map((_, i) => (
                        <TableHead key={i}>
                            <Skeleton className="h-4 w-24" />
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({ length: rowCount }).map((_, rowIndex) => (
                    <TableRow key={rowIndex}>
                        {Array.from({ length: columnCount }).map((_, colIndex) => (
                            <TableCell key={colIndex}>
                                <Skeleton className="h-4 w-full" />
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/ui/src/components/ui/data-table-skeleton.tsx
git commit -m "feat(ui): add DataTableSkeleton component"
```

---

### Task 5: Create the main DataTable component

**Files:**
- Create: `packages/ui/src/components/ui/data-table.tsx`

This depends on the skeleton component from Task 4.

- [ ] **Step 1: Create the DataTable component**

Create `packages/ui/src/components/ui/data-table.tsx`:

```tsx
import { flexRender, type ColumnDef, type Table as ReactTable } from '@tanstack/react-table';

import { cn } from '@krak/ui/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@krak/ui/components/ui/table';
import { DataTableSkeleton } from '@krak/ui/components/ui/data-table-skeleton';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    table: ReactTable<TData>;
    loading?: boolean;
    skeletonRows?: number;
    stickyHeader?: boolean;
    children?: React.ReactNode;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    table,
    loading = false,
    skeletonRows = 5,
    stickyHeader = false,
    children,
}: DataTableProps<TData, TValue>) {
    return (
        <div className="space-y-4">
            <div className={cn('rounded-md border', stickyHeader && 'max-h-[calc(100vh-200px)] overflow-auto')}>
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
                                        className="group"
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

- [ ] **Step 2: Commit**

```bash
git add packages/ui/src/components/ui/data-table.tsx
git commit -m "feat(ui): add DataTable component"
```

---

### Task 6: Create DataTablePagination component

**Files:**
- Create: `packages/ui/src/components/ui/data-table-pagination.tsx`

- [ ] **Step 1: Create the DataTablePagination component**

Create `packages/ui/src/components/ui/data-table-pagination.tsx`:

```tsx
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@krak/ui/components/ui/button';

interface DataTablePaginationProps {
    page: number;
    totalPages: number;
    total: number;
    perPage: number;
    onPageChange: (page: number) => void;
}

export function DataTablePagination({ page, totalPages, total, perPage, onPageChange }: DataTablePaginationProps) {
    const from = (page - 1) * perPage + 1;
    const to = Math.min(page * perPage, total);

    return (
        <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
                Showing {from}-{to} of {total}
            </p>
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(Math.max(1, page - 1))}
                    disabled={page <= 1}
                >
                    <ChevronLeft className="size-4" />
                    Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                    disabled={page >= totalPages}
                >
                    Next
                    <ChevronRight className="size-4" />
                </Button>
            </div>
        </div>
    );
}
```

- [ ] **Step 2: Commit**

```bash
git add packages/ui/src/components/ui/data-table-pagination.tsx
git commit -m "feat(ui): add DataTablePagination component"
```

---

### Task 7: Export all DataTable components from @krak/ui

**Files:**
- Modify: `packages/ui/src/index.ts`

- [ ] **Step 1: Add exports to the barrel file**

Add the following exports to the end of `packages/ui/src/index.ts`:

```ts
export { DataTable } from './components/ui/data-table';
export { DataTableColumnHeader } from './components/ui/data-table-column-header';
export { DataTablePagination } from './components/ui/data-table-pagination';
export { DataTableRowActions } from './components/ui/data-table-row-actions';
export { DataTableSkeleton } from './components/ui/data-table-skeleton';
```

- [ ] **Step 2: Build the UI package**

Run: `bun run build` (from `packages/ui/`)
Expected: Build succeeds with no errors. The new components are included in `dist/index.mjs`.

- [ ] **Step 3: Commit**

```bash
git add packages/ui/src/index.ts
git commit -m "feat(ui): export DataTable components from barrel"
```

---

### Task 8: Migrate the users page to use new DataTable components

**Files:**
- Modify: `apps/manager/src/app/(dashboard)/users/columns.tsx`
- Modify: `apps/manager/src/app/(dashboard)/users/page.tsx`
- Delete: `apps/manager/src/components/data-table.tsx`

- [ ] **Step 1: Update columns.tsx to use DataTableColumnHeader and DataTableRowActions**

Replace the contents of `apps/manager/src/app/(dashboard)/users/columns.tsx`:

```tsx
'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Badge, DataTableColumnHeader, DataTableRowActions, DropdownMenuItem } from '@krak/ui';

import type { ContractOutputs } from '@krak/contracts';

export type AdminUser = ContractOutputs['admin']['users']['list']['users'][number];

export const columns: ColumnDef<AdminUser>[] = [
    {
        accessorKey: 'username',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Username" />,
        cell: ({ row }) => <span className="font-medium">{row.getValue('username')}</span>,
    },
    {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => <span className="text-muted-foreground">{row.getValue('email') ?? '-'}</span>,
    },
    {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }) => {
            const role = row.getValue('role') as string;
            return (
                <Badge variant={role === 'ADMIN' ? 'default' : role === 'MODERATOR' ? 'secondary' : 'outline'}>
                    {role}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'banned',
        header: 'Status',
        cell: ({ row }) => {
            const banned = row.getValue('banned') as boolean;
            return banned ? (
                <Badge variant="destructive">Banned</Badge>
            ) : (
                <Badge variant="outline">Active</Badge>
            );
        },
    },
    {
        accessorKey: 'createdAt',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
        cell: ({ row }) => {
            const date = new Date(row.getValue('createdAt'));
            return <span className="text-muted-foreground">{date.toLocaleDateString()}</span>;
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => (
            <DataTableRowActions>
                <DropdownMenuItem onClick={() => console.log('View details', row.original)}>
                    View details
                </DropdownMenuItem>
            </DataTableRowActions>
        ),
    },
];
```

Note: The "View details" action uses `console.log` as a placeholder. The actual navigation will depend on whether a user detail page exists. This can be wired up later with `useRouter` when the detail page is built.

- [ ] **Step 2: Update page.tsx to use new DataTable and DataTablePagination**

Replace the contents of `apps/manager/src/app/(dashboard)/users/page.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCoreRowModel, useReactTable, type SortingState } from '@tanstack/react-table';
import { Input, DataTable, DataTablePagination } from '@krak/ui';

import { orpc } from '@/lib/orpc';
import { SiteHeader } from '@/components/site-header';
import { columns } from './columns';

export default function UsersPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [sorting, setSorting] = useState<SortingState>([{ id: 'createdAt', desc: true }]);

    const perPage = 20;

    // Map TanStack Table sorting state to API params
    const sortBy = (sorting[0]?.id as 'username' | 'createdAt') ?? 'createdAt';
    const sortOrder = sorting[0]?.desc ? ('desc' as const) : ('asc' as const);

    const { data, isLoading } = useQuery(
        orpc.admin.users.list.queryOptions({
            input: {
                page,
                perPage,
                sortBy,
                sortOrder,
                search: debouncedSearch || undefined,
            },
        }),
    );

    const totalPages = data ? Math.ceil(data.total / perPage) : 0;

    const table = useReactTable({
        data: data?.users ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualSorting: true,
        state: { sorting },
        onSortingChange: setSorting,
    });

    // Simple debounce for search
    let searchTimeout: ReturnType<typeof setTimeout>;
    function handleSearchChange(value: string) {
        setSearch(value);
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            setDebouncedSearch(value);
            setPage(1);
        }, 300);
    }

    return (
        <>
            <SiteHeader title="Users" />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="flex items-center gap-4">
                    <Input
                        placeholder="Search by username or email..."
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="max-w-sm"
                    />
                </div>

                <DataTable
                    columns={columns}
                    data={data?.users ?? []}
                    table={table}
                    loading={isLoading}
                    skeletonRows={perPage}
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

- [ ] **Step 3: Delete the old DataTable component**

Delete: `apps/manager/src/components/data-table.tsx`

Run: `rm apps/manager/src/components/data-table.tsx`

- [ ] **Step 4: Verify no other files import the old DataTable**

Run: `grep -r "from '@/components/data-table'" apps/manager/src/`
Expected: No results (the only consumer was `users/page.tsx` which now imports from `@krak/ui`).

- [ ] **Step 5: Commit**

```bash
git add apps/manager/src/app/(dashboard)/users/columns.tsx apps/manager/src/app/(dashboard)/users/page.tsx
git rm apps/manager/src/components/data-table.tsx
git commit -m "feat(manager): migrate users page to new DataTable components"
```

---

### Task 9: Build verification

**Files:** None (verification only)

- [ ] **Step 1: Build the UI package**

Run (from repo root): `bun run build --filter=@krak/ui`
Expected: Build succeeds. Check that `packages/ui/dist/index.mjs` contains the DataTable components.

- [ ] **Step 2: Build the manager app**

Run (from repo root): `bun run build --filter=@krak/manager`
Expected: Build succeeds with no type errors.

- [ ] **Step 3: Commit (if any lockfile changes)**

```bash
git add -A && git status
# Only commit if there are meaningful changes (lockfile updates, etc.)
```
