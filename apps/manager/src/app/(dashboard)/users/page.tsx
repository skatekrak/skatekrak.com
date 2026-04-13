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
