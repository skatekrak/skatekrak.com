'use client';

import { useQuery } from '@tanstack/react-query';
import { getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import { parseAsString, useQueryState } from 'nuqs';

import type { ContractOutputs } from '@krak/contracts';
import { DataTable, Input, Sheet, SheetContent } from '@krak/ui';

import { SiteHeader } from '@/components/site-header';
import { orpc } from '@/lib/orpc';

import { HashtagDetail } from './_components/hashtag-detail';

type AdminHashtag = ContractOutputs['admin']['hashtags']['list'][number];

const columns: ColumnDef<AdminHashtag>[] = [
    {
        accessorKey: 'tag',
        header: 'Hashtag',
        cell: ({ row }) => <span className="font-medium">{row.original.tag}</span>,
    },
    { accessorKey: 'mediaCount', header: 'Media' },
];

export default function HashtagsPage() {
    const [search, setSearch] = useQueryState('search', parseAsString.withDefault('').withOptions({ throttleMs: 300 }));
    const [selected, setSelected] = useQueryState('tag');

    const { data, isLoading } = useQuery(
        orpc.admin.hashtags.list.queryOptions({ input: { search: search || undefined, limit: 100 } }),
    );

    const table = useReactTable({ data: data ?? [], columns, getCoreRowModel: getCoreRowModel() });

    return (
        <>
            <SiteHeader title="Hashtags" />
            <div className="flex flex-1 flex-col gap-6 px-6 pb-6 pt-4">
                <Input
                    placeholder="Search hashtags..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value || null)}
                    className="max-w-sm"
                />
                <DataTable
                    columns={columns}
                    table={table}
                    loading={isLoading}
                    skeletonRows={20}
                    onRowClick={(row) => setSelected(row.original.tag)}
                />
            </div>
            <Sheet open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
                <SheetContent className="flex flex-col sm:max-w-md">
                    {selected && <HashtagDetail tag={selected} onSelectTag={setSelected} />}
                </SheetContent>
            </Sheet>
        </>
    );
}
