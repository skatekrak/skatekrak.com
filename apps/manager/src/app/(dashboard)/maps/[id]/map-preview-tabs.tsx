'use client';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useMemo } from 'react';

import type { ContractOutputs } from '@krak/contracts';
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

import { orpc } from '@/lib/orpc';

type MapData = ContractOutputs['maps']['fetch'];

const directTagCategories = ['Maps', 'Skateparks', 'Shops'];

interface MapPreviewTabsProps {
    map: MapData;
}

export function MapPreviewTabs({ map }: MapPreviewTabsProps) {
    const tagsFromMedia = useMemo(() => {
        if (map.categories.length === 0) return true;
        return !map.categories.some((cat) => directTagCategories.includes(cat));
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
        orpc.media.list.infiniteOptions({
            input: (pageParam: Date | undefined) => ({
                hashtag: map.id,
                limit: 20,
                cursor: pageParam,
            }),
            initialPageParam: undefined as Date | undefined,
            getNextPageParam: (lastPage) => {
                if (lastPage.length < 20) return undefined;
                const lastElement = lastPage[lastPage.length - 1];
                return lastElement?.createdAt ?? undefined;
            },
        }),
    );

    const medias = mediaPages?.pages.flat() ?? [];
    const spotsCount = spots?.length ?? 0;
    const mediasCount = medias.length;

    return (
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
                            <div className="grid grid-cols-3 gap-2">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <Skeleton key={i} className="aspect-square w-full" />
                                ))}
                            </div>
                        ) : mediasCount === 0 ? (
                            <p className="text-sm text-muted-foreground">No media for this map</p>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <div className="grid grid-cols-3 gap-2">
                                    {medias.map((media) => (
                                        <div key={media.id} className="flex flex-col gap-1">
                                            <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
                                                {media.image?.url ? (
                                                    <img
                                                        src={media.image.url}
                                                        alt={media.caption ?? ''}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                                                        {media.type}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="truncate text-xs text-muted-foreground">
                                                {media.addedBy.username}
                                            </span>
                                        </div>
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
    );
}
