'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Badge, Button } from '@krak/ui';

import type { ContractOutputs } from '@krak/contracts';

export type AdminUser = ContractOutputs['admin']['users']['list']['users'][number];

export const columns: ColumnDef<AdminUser>[] = [
    {
        accessorKey: 'username',
        header: ({ column }) => (
            <Button variant="ghost" size="sm" className="-ml-3" onClick={() => column.toggleSorting()}>
                Username
                <ArrowUpDown className="ml-2 size-4" />
            </Button>
        ),
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
        header: ({ column }) => (
            <Button variant="ghost" size="sm" className="-ml-3" onClick={() => column.toggleSorting()}>
                Created
                <ArrowUpDown className="ml-2 size-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const date = new Date(row.getValue('createdAt'));
            return <span className="text-muted-foreground">{date.toLocaleDateString()}</span>;
        },
    },
];
