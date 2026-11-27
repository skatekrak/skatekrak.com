'use client';

import { useQuery } from '@tanstack/react-query';
import { getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';

import type { ContractOutputs } from '@krak/contracts';
import { DataTable, DataTablePagination, Input, Sheet, SheetContent } from '@krak/ui';

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

export default function HashtagsPage() {
    const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
    const [search, setSearch] = useQueryState('search', parseAsString.withDefault('').withOptions({ throttleMs: 300 }));
    const [selected, setSelected] = useQueryState('tag');

    const { data, isLoading } = useQuery(
        orpc.admin.hashtags.list.queryOptions({ input: { search: search || undefined, page, perPage } }),
    );

    const table = useReactTable({ data: data?.hashtags ?? [], columns, getCoreRowModel: getCoreRowModel() });

    return (
        <>
            <SiteHeader title="Hashtags" />
            <div className="flex flex-1 flex-col gap-6 px-6 pb-6 pt-4">
                <Input
                    placeholder="Search hashtags..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value || null);
                        setPage(1);
                    }}
                    className="max-w-sm"
                />
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
