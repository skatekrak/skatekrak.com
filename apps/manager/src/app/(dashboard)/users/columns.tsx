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
        header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
        enableSorting: false,
        cell: ({ row }) => <span className="text-muted-foreground">{row.getValue('email') ?? '-'}</span>,
    },
    {
        accessorKey: 'role',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
        enableSorting: false,
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
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        enableSorting: false,
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
