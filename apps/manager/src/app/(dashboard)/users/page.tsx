'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { SortingState } from '@tanstack/react-table';
import { Button, Input, Skeleton } from '@krak/ui';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { orpc } from '@/lib/orpc';
import { DataTable } from '@/components/data-table';
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

                {isLoading ? (
                    <div className="space-y-3">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                ) : (
                    <>
                        <DataTable
                            columns={columns}
                            data={data?.users ?? []}
                            sorting={sorting}
                            onSortingChange={setSorting}
                        />

                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                {data ? (
                                    <>
                                        Showing {(page - 1) * perPage + 1}-
                                        {Math.min(page * perPage, data.total)} of {data.total} users
                                    </>
                                ) : (
                                    'Loading...'
                                )}
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
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
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page >= totalPages}
                                >
                                    Next
                                    <ChevronRight className="size-4" />
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
