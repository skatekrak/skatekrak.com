'use client';

import { useQuery } from '@tanstack/react-query';
import { getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import { parseAsInteger, parseAsString, parseAsStringLiteral, useQueryState } from 'nuqs';

import type { ContractOutputs } from '@krak/contracts';
import {
    DataTable,
    DataTablePagination,
    Input,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Sheet,
    SheetContent,
} from '@krak/ui';

import { SiteHeader } from '@/components/site-header';
import { orpc } from '@/lib/orpc';

import { HashtagDetail } from './_components/hashtag-detail';

type AdminHashtag = ContractOutputs['admin']['hashtags']['list']['hashtags'][number];

const columns: ColumnDef<AdminHashtag>[] = [
    {
        accessorKey: 'tag',
        header: 'Hashtag',
        cell: ({ row }) => <span className="font-medium">{row.original.tag}</span>,
    },
    { accessorKey: 'mediaCount', header: 'Media' },
    {
        accessorKey: 'mapName',
        header: 'Map',
        cell: ({ row }) => row.original.mapName ?? <span className="text-muted-foreground">—</span>,
    },
];

const perPage = 50;
const mapFilters = ['linked', 'unlinked'] as const;

export default function HashtagsPage() {
    const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
    const [search, setSearch] = useQueryState('search', parseAsString.withDefault('').withOptions({ throttleMs: 300 }));
    const [mapFilter, setMapFilter] = useQueryState('map', parseAsStringLiteral(mapFilters));
    const [selected, setSelected] = useQueryState('tag');

    const hasMap = mapFilter ? mapFilter === 'linked' : undefined;
    const { data, isLoading } = useQuery(
        orpc.admin.hashtags.list.queryOptions({ input: { search: search || undefined, hasMap, page, perPage } }),
    );

    const table = useReactTable({ data: data?.hashtags ?? [], columns, getCoreRowModel: getCoreRowModel() });

    return (
        <>
            <SiteHeader title="Hashtags" />
            <div className="flex flex-1 flex-col gap-6 px-6 pb-6 pt-4">
                <div className="flex items-center gap-3">
                    <Input
                        placeholder="Search hashtags..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value || null);
                            setPage(1);
                        }}
                        className="max-w-sm"
                    />
                    <Select
                        value={mapFilter ?? 'all'}
                        onValueChange={(value) => {
                            setMapFilter(value === 'all' ? null : (value as (typeof mapFilters)[number]));
                            setPage(1);
                        }}
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Map" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All hashtags</SelectItem>
                            <SelectItem value="linked">Linked to a map</SelectItem>
                            <SelectItem value="unlinked">No map</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <DataTable
                    columns={columns}
                    table={table}
                    loading={isLoading}
                    skeletonRows={20}
                    onRowClick={(row) => setSelected(row.original.tag)}
                >
                    {data && (
                        <DataTablePagination
                            page={page}
                            totalPages={Math.ceil(data.total / perPage)}
                            total={data.total}
                            perPage={perPage}
                            onPageChange={setPage}
                        />
                    )}
                </DataTable>
            </div>
            <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
                <SheetContent className="flex flex-col sm:max-w-md">
                    {selected && <HashtagDetail tag={selected} onSelectTag={setSelected} />}
                </SheetContent>
            </Sheet>
        </>
    );
}
