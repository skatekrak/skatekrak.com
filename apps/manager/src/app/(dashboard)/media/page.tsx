'use client';

import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { parseAsInteger, parseAsString, parseAsStringLiteral, useQueryState } from 'nuqs';
import { useCallback, useState } from 'react';

import {
    Button,
    DataTablePagination,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Tabs,
    TabsList,
    TabsTrigger,
} from '@krak/ui';

import { AddMediaDialog } from '@/components/media/add-media-dialog';
import { MediaCard, MediaCardSkeleton } from '@/components/media/media-card';
import { MediaDetailDialog } from '@/components/media/media-detail-dialog';
import { SiteHeader } from '@/components/site-header';
import { orpc } from '@/lib/orpc';

const mediaTypes = ['IMAGE', 'VIDEO'] as const;
const releaseStatuses = ['released', 'planned'] as const;

function scrollToTop() {
    requestAnimationFrame(() => {
        window.scrollTo({ top: 0 });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    });
}

export default function MediaPage() {
    const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
    const [type, setType] = useQueryState('type', parseAsStringLiteral(mediaTypes));
    const [releaseStatus, setReleaseStatus] = useQueryState(
        'status',
        parseAsStringLiteral(releaseStatuses).withDefault('released'),
    );
    const [selectedMediaId, setSelectedMediaId] = useQueryState('media', parseAsString);
    const [showAddDialog, setShowAddDialog] = useState(false);

    const perPage = 24;

    const { data, isLoading } = useQuery(
        orpc.admin.media.list.queryOptions({
            input: {
                page,
                perPage,
                sortBy: 'createdAt',
                sortOrder: 'desc',
                type: type ?? undefined,
                releaseStatus,
            },
        }),
    );

    const totalPages = data ? Math.ceil(data.total / perPage) : 0;

    const handlePageChange = useCallback(
        (newPage: number) => {
            setPage(newPage);
            scrollToTop();
        },
        [setPage],
    );

    function handleTypeChange(value: string) {
        setType(value === 'all' ? null : (value as (typeof mediaTypes)[number]));
        handlePageChange(1);
    }

    function handleTabChange(value: string) {
        setReleaseStatus(value as (typeof releaseStatuses)[number]);
        setPage(1);
    }

    return (
        <>
            <SiteHeader title="Media" />
            <div className="flex flex-1 flex-col gap-6 px-6 pb-6 pt-4">
                {/* Tabs + Filters */}
                <div className="flex items-center gap-4">
                    <Tabs value={releaseStatus} onValueChange={handleTabChange}>
                        <TabsList>
                            <TabsTrigger value="released">Media</TabsTrigger>
                            <TabsTrigger value="planned">Planned</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <Select value={type ?? 'all'} onValueChange={handleTypeChange}>
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All types</SelectItem>
                            <SelectItem value="IMAGE">Image</SelectItem>
                            <SelectItem value="VIDEO">Video</SelectItem>
                        </SelectContent>
                    </Select>
                    {data && (
                        <span className="text-sm text-muted-foreground">{data.total.toLocaleString()} media total</span>
                    )}
                    <div className="ml-auto">
                        <Button onClick={() => setShowAddDialog(true)}>
                            <Plus className="size-4" />
                            Add media
                        </Button>
                    </div>
                </div>

                {/* Card grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {Array.from({ length: perPage }).map((_, i) => (
                            <MediaCardSkeleton key={i} />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {data?.media.map((m) => (
                            <MediaCard key={m.id} media={m} onClick={() => setSelectedMediaId(m.id)} />
                        ))}
                    </div>
                )}

                {/* Bottom pagination */}
                {data && totalPages > 1 && (
                    <DataTablePagination
                        page={page}
                        totalPages={totalPages}
                        total={data.total}
                        perPage={perPage}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>

            {/* Media detail modal */}
            <MediaDetailDialog
                mediaId={selectedMediaId}
                mediaList={data?.media}
                onClose={() => setSelectedMediaId(null)}
            />

            {/* Add media modal */}
            <AddMediaDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
        </>
    );
}
