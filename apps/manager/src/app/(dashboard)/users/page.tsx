'use client';

import { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCoreRowModel, useReactTable, type SortingState } from '@tanstack/react-table';
import {
    Input,
    DataTable,
    DataTablePagination,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@krak/ui';

import { orpc } from '@/lib/orpc';
import { SiteHeader } from '@/components/site-header';
import { columns } from './columns';

type RoleFilter = 'USER' | 'MODERATOR' | 'ADMIN' | undefined;
type StatusFilter = boolean | undefined;

export default function UsersPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [sorting, setSorting] = useState<SortingState>([{ id: 'createdAt', desc: true }]);
    const [roleFilter, setRoleFilter] = useState<RoleFilter>(undefined);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>(undefined);

    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

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
                role: roleFilter,
                banned: statusFilter,
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

    function handleSearchChange(value: string) {
        setSearch(value);
        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = setTimeout(() => {
            setDebouncedSearch(value);
            setPage(1);
        }, 300);
    }

    function handleRoleChange(value: string) {
        setRoleFilter(value === 'all' ? undefined : (value as RoleFilter));
        setPage(1);
    }

    function handleStatusChange(value: string) {
        setStatusFilter(value === 'all' ? undefined : value === 'banned');
        setPage(1);
    }

    return (
        <>
            <SiteHeader title="Users" />
            <div className="flex flex-1 flex-col gap-6 px-6 pb-6 pt-4">
                <div className="flex items-center gap-3">
                    <Input
                        placeholder="Search by username or email..."
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="max-w-sm"
                    />
                    <Select value={roleFilter ?? 'all'} onValueChange={handleRoleChange}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All roles</SelectItem>
                            <SelectItem value="USER">User</SelectItem>
                            <SelectItem value="MODERATOR">Moderator</SelectItem>
                            <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select
                        value={statusFilter === undefined ? 'all' : statusFilter ? 'banned' : 'active'}
                        onValueChange={handleStatusChange}
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All statuses</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="banned">Banned</SelectItem>
                        </SelectContent>
                    </Select>
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
