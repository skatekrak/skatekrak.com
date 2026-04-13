# DataTable Component Redesign

## Summary

Replace the minimal DataTable in `apps/manager` with a composable, reusable set of data table components in `@krak/ui`. Uses TanStack Table (already a dependency) with shadcn-style composable sub-components.

## Requirements

- Built-in server-side pagination controls
- Loading/skeleton states
- Improved sortable column headers with clear direction indicators
- Sticky headers for long tables
- Per-row action dropdown menus
- Lives in `@krak/ui` for reuse across apps
- Follows shadcn composable pattern

## Architecture

### New files in `packages/ui/src/components/ui/`

| File | Component | Purpose |
|------|-----------|---------|
| `data-table.tsx` | `DataTable<TData>` | Core table rendering with TanStack Table |
| `data-table-pagination.tsx` | `DataTablePagination` | Pagination controls (prev/next, page info) |
| `data-table-column-header.tsx` | `DataTableColumnHeader` | Sortable column header with sort indicator |
| `data-table-row-actions.tsx` | `DataTableRowActions` | Dropdown menu trigger for per-row actions |
| `data-table-skeleton.tsx` | `DataTableSkeleton` | Loading state skeleton matching table layout |

### Dependency changes

- Add `@tanstack/react-table` as a **peer dependency** of `@krak/ui` (and as a dev dependency for building)
- Keep `@tanstack/react-table` in `apps/manager` as it satisfies the peer dep and is needed for `useReactTable()`, `getCoreRowModel()`, `ColumnDef`, `SortingState` etc.
- `@krak/ui` re-exports commonly needed types (`ColumnDef`, `SortingState`, `OnChangeFn`) for convenience, but consumers can also import directly from `@tanstack/react-table`

## Component APIs

### DataTable<TData, TValue>

```tsx
interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    table: ReactTable<TData>;
    loading?: boolean;
    skeletonRows?: number;       // default: 5
    stickyHeader?: boolean;      // default: false
    children?: React.ReactNode;  // slot for pagination, toolbar
}
```

The consumer creates the TanStack table instance with `useReactTable()` and passes it in. This gives full control over sorting, pagination config, etc. The DataTable renders it.

When `loading={true}`, the table body is replaced with `DataTableSkeleton`. Headers still render to prevent layout shift.

Children are rendered below the table (inside the same rounded border container), used for pagination or toolbar.

### DataTablePagination

```tsx
interface DataTablePaginationProps {
    page: number;
    totalPages: number;
    total: number;
    perPage: number;
    onPageChange: (page: number) => void;
}
```

Layout: "Showing 1-20 of 150" on the left, "Previous | Page X of Y | Next" on the right.

Buttons use `variant="outline" size="sm"` with `ChevronLeft`/`ChevronRight` icons.

### DataTableColumnHeader<TData, TValue>

```tsx
interface DataTableColumnHeaderProps<TData, TValue> {
    column: Column<TData, TValue>;
    title: string;
    className?: string;
}
```

Sort indicators:
- **Unsorted:** dimmed `ChevronsUpDown` icon
- **Ascending:** `ArrowUp` icon
- **Descending:** `ArrowDown` icon
- Click cycles: none -> asc -> desc -> none

Used in column definitions:
```tsx
header: ({ column }) => <DataTableColumnHeader column={column} title="Username" />
```

### DataTableRowActions

```tsx
interface DataTableRowActionsProps {
    children: React.ReactNode;  // DropdownMenuItems
}
```

Renders a "..." (MoreHorizontal) icon button that opens a `DropdownMenu`. The button uses `opacity-0 group-hover:opacity-100` on the row for subtle UX (visible on hover).

Used in column definitions:
```tsx
cell: ({ row }) => (
    <DataTableRowActions>
        <DropdownMenuItem onClick={() => router.push(`/users/${row.original.id}`)}>
            View details
        </DropdownMenuItem>
    </DataTableRowActions>
)
```

### DataTableSkeleton

```tsx
interface DataTableSkeletonProps {
    columnCount: number;
    rowCount?: number;  // default: 5
}
```

Renders a table with skeleton cells. Used internally by `DataTable` when `loading={true}`, but also exported for standalone use.

## Visual & Behavior Details

### Sticky Header

When `stickyHeader={true}`:
- `<thead>` gets `sticky top-0 z-10 bg-background`
- Table container gets `max-h-[calc(100vh-200px)] overflow-auto` (overridable via className)

### Loading State

When `loading={true}`:
- Table headers render normally
- Table body replaced with `DataTableSkeleton` (animated pulse rows)
- Pagination and other children still render but with disabled state

### Empty State

When data is empty and not loading:
- Centered "No results." text spanning all columns
- Same as current behavior

### Row hover

Table rows get `group` class. Row actions use `group-hover:opacity-100` to appear on hover.

## Migration Plan

1. Create all new components in `@krak/ui`
2. Export them from `packages/ui/src/index.ts`
3. Refactor `apps/manager/src/app/(dashboard)/users/page.tsx` to use new components
4. Update `apps/manager/src/app/(dashboard)/users/columns.tsx` to use `DataTableColumnHeader` and `DataTableRowActions`
5. Delete `apps/manager/src/components/data-table.tsx` (replaced by `@krak/ui` version)

## Consumer Example (after migration)

```tsx
// users/page.tsx
const table = useReactTable({
    data: data?.users ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    state: { sorting },
    onSortingChange: setSorting,
});

return (
    <DataTable columns={columns} data={data?.users ?? []} table={table} loading={isLoading} stickyHeader>
        <DataTablePagination
            page={page}
            totalPages={totalPages}
            total={data?.total ?? 0}
            perPage={perPage}
            onPageChange={setPage}
        />
    </DataTable>
);
```

## Out of Scope

- Client-side pagination mode
- Column visibility toggle
- Row selection/checkboxes
- Built-in search/filtering toolbar
- These can be added as additional sub-components later following the same composable pattern.
