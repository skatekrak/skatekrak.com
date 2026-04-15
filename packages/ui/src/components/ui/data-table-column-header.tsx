import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';

import { cn } from '@krak/ui/lib/utils';

import type { Column } from '@tanstack/react-table';

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
    column: Column<TData, TValue>;
    title: string;
}

export function DataTableColumnHeader<TData, TValue>({
    column,
    title,
    className,
}: DataTableColumnHeaderProps<TData, TValue>) {
    const canSort = column.getCanSort();

    return (
        <div
            className={cn('flex items-center gap-2', canSort && 'cursor-pointer select-none', className)}
            onClick={canSort ? () => column.toggleSorting() : undefined}
        >
            <span>{title}</span>
            {canSort &&
                (column.getIsSorted() === 'desc' ? (
                    <ArrowDown className="size-4 text-foreground" />
                ) : column.getIsSorted() === 'asc' ? (
                    <ArrowUp className="size-4 text-foreground" />
                ) : (
                    <ChevronsUpDown className="size-4 text-muted-foreground/50" />
                ))}
        </div>
    );
}
