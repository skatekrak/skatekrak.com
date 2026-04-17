'use client';

import { useQuery } from '@tanstack/react-query';
import { getCoreRowModel, useReactTable, type SortingState } from '@tanstack/react-table';
import { ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { parseAsArrayOf, parseAsInteger, parseAsString, parseAsStringLiteral, useQueryState } from 'nuqs';
import { useState } from 'react';

import {
    Button,
    DataTable,
    DataTablePagination,
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
    Input,
} from '@krak/ui';

import { orpc } from '@/lib/orpc';

import { columns } from './columns';

const spotTypes = ['SHOP', 'STREET', 'PARK', 'DIY', 'PRIVATE'] as const;
const spotStatuses = ['ACTIVE', 'WIP', 'RIP'] as const;

type SpotType = (typeof spotTypes)[number];
type SpotStatus = (typeof spotStatuses)[number];

export default function SpotsListPage() {
    const router = useRouter();
    const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
    const [search, setSearch] = useQueryState('search', parseAsString.withDefault('').withOptions({ throttleMs: 300 }));
    const [types, setTypes] = useQueryState('type', parseAsArrayOf(parseAsStringLiteral(spotTypes)));
    const [statuses, setStatuses] = useQueryState('status', parseAsArrayOf(parseAsStringLiteral(spotStatuses)));
    const [sorting, setSorting] = useState<SortingState>([{ id: 'createdAt', desc: true }]);

    const perPage = 20;

    const sortBy = (sorting[0]?.id as 'name' | 'createdAt' | 'updatedAt') ?? 'createdAt';
    const sortOrder = sorting[0]?.desc ? ('desc' as const) : ('asc' as const);

    const selectedTypes = types ?? [];
    const selectedStatuses = statuses ?? [];

    const { data, isLoading } = useQuery(
        orpc.admin.spots.list.queryOptions({
            input: {
                page,
                perPage,
                sortBy,
                sortOrder,
                search: search || undefined,
                type: selectedTypes.length > 0 ? selectedTypes : undefined,
                status: selectedStatuses.length > 0 ? selectedStatuses : undefined,
            },
        }),
    );

    const totalPages = data ? Math.ceil(data.total / perPage) : 0;

    const table = useReactTable({
        data: data?.spots ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualSorting: true,
        state: { sorting },
        onSortingChange: setSorting,
    });

    function handleSearchChange(value: string) {
        setSearch(value || null);
        setPage(1);
    }

    function toggleType(value: SpotType) {
        const next = selectedTypes.includes(value)
            ? selectedTypes.filter((t) => t !== value)
            : [...selectedTypes, value];
        setTypes(next.length > 0 ? next : null);
        setPage(1);
    }

    function toggleStatus(value: SpotStatus) {
        const next = selectedStatuses.includes(value)
            ? selectedStatuses.filter((s) => s !== value)
            : [...selectedStatuses, value];
        setStatuses(next.length > 0 ? next : null);
        setPage(1);
    }

    function typeFilterLabel(): string {
        if (selectedTypes.length === 0) return 'All types';
        if (selectedTypes.length === 1) return selectedTypes[0].charAt(0) + selectedTypes[0].slice(1).toLowerCase();
        return `${selectedTypes.length} types`;
    }

    function statusFilterLabel(): string {
        if (selectedStatuses.length === 0) return 'All statuses';
        if (selectedStatuses.length === 1)
            return selectedStatuses[0].charAt(0) + selectedStatuses[0].slice(1).toLowerCase();
        return `${selectedStatuses.length} statuses`;
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
                <Input
                    placeholder="Search by name or city..."
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-40 justify-between">
                            {typeFilterLabel()}
                            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-40">
                        {spotTypes.map((t) => (
                            <DropdownMenuCheckboxItem
                                key={t}
                                checked={selectedTypes.includes(t)}
                                onCheckedChange={() => toggleType(t)}
                                onSelect={(e) => e.preventDefault()}
                            >
                                {t.charAt(0) + t.slice(1).toLowerCase()}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-40 justify-between">
                            {statusFilterLabel()}
                            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-40">
                        {spotStatuses.map((s) => (
                            <DropdownMenuCheckboxItem
                                key={s}
                                checked={selectedStatuses.includes(s)}
                                onCheckedChange={() => toggleStatus(s)}
                                onSelect={(e) => e.preventDefault()}
                            >
                                {s.charAt(0) + s.slice(1).toLowerCase()}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <DataTable
                columns={columns}
                table={table}
                loading={isLoading}
                skeletonRows={perPage}
                onRowClick={(row) => router.push(`/spots/${row.original.id}`)}
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
    );
}
