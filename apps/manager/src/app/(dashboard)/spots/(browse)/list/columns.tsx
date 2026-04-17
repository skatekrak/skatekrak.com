'use client';

import { format } from 'date-fns';

import type { ContractOutputs } from '@krak/contracts';
import { Badge, DataTableColumnHeader } from '@krak/ui';

import type { ColumnDef } from '@tanstack/react-table';

export type AdminSpot = ContractOutputs['admin']['spots']['list']['spots'][number];

export const columns: ColumnDef<AdminSpot>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
        cell: ({ row }) => <span className="font-medium">{row.getValue('name')}</span>,
    },
    {
        accessorKey: 'city',
        header: ({ column }) => <DataTableColumnHeader column={column} title="City" />,
        enableSorting: false,
        cell: ({ row }) => <span className="text-muted-foreground">{row.getValue('city') ?? '-'}</span>,
    },
    {
        accessorKey: 'country',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Country" />,
        enableSorting: false,
        cell: ({ row }) => <span className="text-muted-foreground">{row.getValue('country') ?? '-'}</span>,
    },
    {
        accessorKey: 'type',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
        enableSorting: false,
        cell: ({ row }) => {
            const type = row.getValue('type') as string;
            const variant = type === 'STREET' ? 'default' : type === 'PARK' || type === 'DIY' ? 'secondary' : 'outline';
            return <Badge variant={variant}>{type.toLowerCase()}</Badge>;
        },
    },
    {
        accessorKey: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        enableSorting: false,
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            const variant = status === 'RIP' ? 'destructive' : status === 'WIP' ? 'secondary' : 'outline';
            return <Badge variant={variant}>{status.toLowerCase()}</Badge>;
        },
    },
    {
        accessorKey: 'addedBy',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Added by" />,
        enableSorting: false,
        cell: ({ row }) => {
            const addedBy = row.original.addedBy;
            return <span className="text-muted-foreground">{addedBy?.username ?? '-'}</span>;
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
    {
        accessorKey: 'updatedAt',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Updated" />,
        cell: ({ row }) => {
            const date = new Date(row.getValue('updatedAt'));
            return <span className="text-muted-foreground">{format(date, 'PP')}</span>;
        },
    },
];
