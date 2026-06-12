'use client';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import type { ContractOutputs } from '@krak/contracts';
import { directTagCategoryLabels } from '@krak/contracts';
import {
    Badge,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Skeleton,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@krak/ui';

import { MediaCard, MediaCardSkeleton } from '@/components/media/media-card';
import { MediaDetailDialog } from '@/components/media/media-detail-dialog';
import { orpc } from '@/lib/orpc';

type MapData = ContractOutputs['maps']['fetch'];

interface MapPreviewTabsProps {
    map: MapData;
}

const MEDIA_PER_PAGE = 24;

export function MapPreviewTabs({ map }: MapPreviewTabsProps) {
    const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);

    const tagsFromMedia = useMemo(() => {
        if (map.categories.length === 0) return true;
        return !map.categories.some((cat) => directTagCategoryLabels.includes(cat));
    }, [map.categories]);

    const { data: spots, isLoading: spotsLoading } = useQuery(
        orpc.spots.listByTags.queryOptions({
            input: {
                tags: [map.id],
                tagsFromMedia,
            },
        }),
    );

    const {
        data: mediaPages,
        isLoading: mediaLoading,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery(
        orpc.admin.media.list.infiniteOptions({
            input: (pageParam: number) => ({
                hashtags: [map.id],
                page: pageParam,
                perPage: MEDIA_PER_PAGE,
                sortBy: 'createdAt' as const,
                sortOrder: 'desc' as const,
            }),
            initialPageParam: 1,
            getNextPageParam: (lastPage, _allPages, lastPageParam) => {
                if (lastPage.page * MEDIA_PER_PAGE >= lastPage.total) return undefined;
                return lastPageParam + 1;
            },
        }),
    );

    const medias = mediaPages?.pages.flatMap((page) => page.media) ?? [];
    const spotsCount = spots?.length ?? 0;
    const mediasCount = mediaPages?.pages[0]?.total ?? medias.length;

    return (
        <>
            <Tabs defaultValue="spots">
                <TabsList>
                    <TabsTrigger value="spots">Spots{!spotsLoading && ` (${spotsCount})`}</TabsTrigger>
                    <TabsTrigger value="media">Media{!mediaLoading && ` (${mediasCount})`}</TabsTrigger>
                </TabsList>

                {/* Spots Tab */}
                <TabsContent value="spots">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Spots</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {spotsLoading ? (
                                <div className="flex flex-col gap-2">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Skeleton key={i} className="h-10 w-full" />
                                    ))}
                                </div>
                            ) : spotsCount === 0 ? (
                                <p className="text-sm text-muted-foreground">No spots linked to this map</p>
                            ) : (
                                <div className="flex flex-col divide-y">
                                    {spots!.map((spot) => (
                                        <Link
                                            key={spot.id}
                                            href={`/spots/${spot.id}`}
                                            className="-mx-2 flex items-center justify-between rounded-sm px-2 py-2 hover:bg-muted/50"
                                        >
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-sm font-medium">{spot.name}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {[spot.location.city, spot.location.country]
                                                        .filter(Boolean)
                                                        .join(', ') || '\u2014'}
                                                </span>
                                            </div>
                                            <Badge variant="outline" className="text-xs">
                                                {spot.type.toLowerCase()}
                                            </Badge>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Media Tab */}
                <TabsContent value="media">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Media</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {mediaLoading ? (
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                                    {Array.from({ length: 8 }).map((_, i) => (
                                        <MediaCardSkeleton key={i} />
                                    ))}
                                </div>
                            ) : mediasCount === 0 ? (
                                <p className="text-sm text-muted-foreground">No media for this map</p>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                                        {medias.map((media) => (
                                            <MediaCard
                                                key={media.id}
                                                media={media}
                                                onClick={() => setSelectedMediaId(media.id)}
                                            />
                                        ))}
                                    </div>
                                    {hasNextPage && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => fetchNextPage()}
                                            disabled={isFetchingNextPage}
                                        >
                                            {isFetchingNextPage ? 'Loading...' : 'Load more'}
                                        </Button>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <MediaDetailDialog mediaId={selectedMediaId} mediaList={medias} onClose={() => setSelectedMediaId(null)} />
        </>
    );
}
