'use client';

import { useQuery } from '@tanstack/react-query';
import { getCoreRowModel, useReactTable, type SortingState } from '@tanstack/react-table';
import { ChevronDown, Plus } from 'lucide-react';
import Link from 'next/link';
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

import { SiteHeader } from '@/components/site-header';
import { orpc } from '@/lib/orpc';

import { columns } from './columns';

const mapCategories = [
    'maps',
    'video',
    'skater',
    'filmer',
    'photographer',
    'magazine',
    'skatepark',
    'shop',
    'years',
    'greatest',
    'members',
    'artist',
] as const;

type MapCategory = (typeof mapCategories)[number];

const categoryLabels: Record<string, string> = {
    maps: 'Maps',
    video: 'Video',
    skater: 'Skaters',
    filmer: 'Filmers',
    photographer: 'Photographers',
    magazine: 'Magazines',
    skatepark: 'Skateparks',
    shop: 'Shops',
    years: 'Years',
    greatest: 'Greatest',
    members: 'Members',
    artist: 'Artists',
};

export default function MapsPage() {
    const router = useRouter();
    const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
    const [search, setSearch] = useQueryState('search', parseAsString.withDefault('').withOptions({ throttleMs: 300 }));
    const [categories, setCategories] = useQueryState('category', parseAsArrayOf(parseAsStringLiteral(mapCategories)));
    const [sorting, setSorting] = useState<SortingState>([{ id: 'createdAt', desc: true }]);

    const perPage = 20;

    const sortBy = (sorting[0]?.id as 'createdAt') ?? 'createdAt';
    const sortOrder = sorting[0]?.desc ? ('desc' as const) : ('asc' as const);

    const selectedCategories = categories ?? [];

    const { data, isLoading } = useQuery(
        orpc.admin.maps.list.queryOptions({
            input: {
                page,
                perPage,
                sortBy,
                sortOrder,
                search: search || undefined,
                categories: selectedCategories.length > 0 ? selectedCategories : undefined,
            },
        }),
    );

    const totalPages = data ? Math.ceil(data.total / perPage) : 0;

    const table = useReactTable({
        data: data?.maps ?? [],
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

    function toggleCategory(value: MapCategory) {
        const next = selectedCategories.includes(value)
            ? selectedCategories.filter((c) => c !== value)
            : [...selectedCategories, value];
        setCategories(next.length > 0 ? next : null);
        setPage(1);
    }

    function categoryFilterLabel(): string {
        if (selectedCategories.length === 0) return 'All categories';
        if (selectedCategories.length === 1) return categoryLabels[selectedCategories[0]] ?? selectedCategories[0];
        return `${selectedCategories.length} categories`;
    }

    return (
        <>
            <SiteHeader title="Maps" />
            <div className="flex flex-1 flex-col gap-6 px-6 pb-6 pt-4">
                <div className="flex items-center gap-3">
                    <Input
                        placeholder="Search by name..."
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="max-w-sm"
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-48 justify-between">
                                {categoryFilterLabel()}
                                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-48">
                            {mapCategories.map((cat) => (
                                <DropdownMenuCheckboxItem
                                    key={cat}
                                    checked={selectedCategories.includes(cat)}
                                    onCheckedChange={() => toggleCategory(cat)}
                                    onSelect={(e) => e.preventDefault()}
                                >
                                    {categoryLabels[cat]}
                                </DropdownMenuCheckboxItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="ml-auto">
                        <Button asChild>
                            <Link href="/maps/new">
                                <Plus className="mr-2 size-4" />
                                Create Map
                            </Link>
                        </Button>
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    table={table}
                    loading={isLoading}
                    skeletonRows={perPage}
                    onRowClick={(row) => router.push(`/maps/${row.original.id}`)}
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
