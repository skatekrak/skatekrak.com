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
