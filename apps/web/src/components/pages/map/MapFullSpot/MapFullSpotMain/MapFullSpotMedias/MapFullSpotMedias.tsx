import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';

import type { Spot, Media } from '@krak/contracts';
import { KrakImage } from '@krak/ui';

import MapMedia from '@/components/pages/map/media/MapMedia';
import { KrakLoading } from '@/components/Ui/Icons/Spinners';
import InfiniteScroll from '@/components/Ui/InfiniteScroll';
import KrakMasonry from '@/components/Ui/Masonry';
import ScrollBar from '@/components/Ui/Scrollbar';
import { flatten } from '@/lib/helpers';
import { useCustomMapID } from '@/lib/hook/queryState';
import { orpc } from '@/server/orpc/client';
import { useSettingsStore } from '@/store/settings';

export type MapFullSpotMediasProps = {
    medias: Media[];
    spot: Spot;
};

const generateShareURL = (spotId: string, mediaId: string) =>
    `${window.location.origin}?modal=1&spot=${spotId}&media=${mediaId}`;
type TabType = 'map' | 'all';

type MediaTabProps = {
    isActive: boolean;
    onClick: () => void;
    children: React.ReactNode;
};

const MediaTab: React.FC<MediaTabProps> = ({ isActive, onClick, children }) => (
    <button
        onClick={onClick}
        className={classNames('flex items-center gap-2 px-3 py-1.5 rounded-sm font-medium border border-transparent', {
            'bg-tertiary-dark/40 text-tertiary-white border-tertiary-light!': isActive,
            'bg-tertiary-medium text-onDark-mediumEmphasis hover:text-onDark-highEmphasis hover:border-tertiary-light':
                !isActive,
        })}
    >
        {children}
    </button>
);

const MapFullSpotMedias: React.FC<MapFullSpotMediasProps> = ({ spot }) => {
    const isMobile = useSettingsStore((state) => state.isMobile);
    const [customMapId] = useCustomMapID();
    const [activeTab, setActiveTab] = useState<TabType>(customMapId ? 'map' : 'all');

    const { data: customMapInfo } = useQuery(
        orpc.maps.fetch.queryOptions({
            input: { id: customMapId ?? '' },
            enabled: !!customMapId,
        }),
    );

    const commonMediaQueryOptions = {
        initialPageParam: undefined,
        getNextPageParam: (lastPage) => {
            if (lastPage.length < 20) return undefined;
            const lastElement = lastPage[lastPage.length - 1];
            return lastElement?.createdAt ?? undefined;
        },
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    };

    const mapMediaQuery = useInfiniteQuery(
        orpc.media.listBySpot.infiniteOptions({
            input: (pageParam: Date | undefined) => ({
                spotId: spot.id,
                limit: 20,
                cursor: pageParam,
                hashtag: customMapId ?? undefined,
            }),
            ...commonMediaQueryOptions,
            enabled: !!customMapId,
        }),
    );

    const otherMediaQuery = useInfiniteQuery(
        orpc.media.listBySpot.infiniteOptions({
            input: (pageParam: Date | undefined) => ({
                spotId: spot.id,
                limit: 20,
                cursor: pageParam,
                excludeHashtag: customMapId ?? undefined,
            }),
            ...commonMediaQueryOptions,
        }),
    );

    const mapMedias = flatten(mapMediaQuery.data?.pages ?? []);
    const otherMedias = flatten(otherMediaQuery.data?.pages ?? []);

    const currentQuery = activeTab === 'map' ? mapMediaQuery : otherMediaQuery;
    const currentMedias = activeTab === 'map' ? mapMedias : otherMedias;

    const hasMapMedia = mapMedias.length > 0 || mapMediaQuery.hasNextPage;
    const hasOtherMedia = otherMedias.length > 0 || otherMediaQuery.hasNextPage;

    useEffect(() => {
        if (customMapId && hasMapMedia) {
            setActiveTab('map');
        } else {
            setActiveTab('all');
        }
    }, [customMapId, hasMapMedia]);

    return (
        <ScrollBar maxHeight="100%">
            <InfiniteScroll
                loadMore={() => {
                    if (currentQuery.hasNextPage) {
                        currentQuery.fetchNextPage();
                    }
                }}
                hasMore={currentQuery.hasNextPage}
                isLoading={currentQuery.isFetching}
            >
                <div className="block p-3 [&_.icon-loading-krak]:mx-auto [&_.icon-loading-krak]:mt-16 [&_.icon-loading-krak]:mb-8 tablet:p-8 tablet:pt-8">
                    {customMapId && (
                        <div className="flex gap-6 max-tablet:justify-center mb-8">
                            {hasMapMedia && (
                                <MediaTab isActive={activeTab === 'map'} onClick={() => setActiveTab('map')}>
                                    <KrakImage
                                        path={`assets/maps/custom-maps/${customMapId}.png`}
                                        options={{ width: 32, height: 32, resizingType: 'fill' }}
                                        alt=""
                                        className="rounded-full w-8 h-8"
                                    />
                                    <span>{customMapInfo?.name ?? customMapId}</span>
                                </MediaTab>
                            )}
                            {hasOtherMedia && (
                                <MediaTab isActive={activeTab === 'all'} onClick={() => setActiveTab('all')}>
                                    Other Media
                                </MediaTab>
                            )}
                        </div>
                    )}

                    <KrakMasonry breakpointCols={isMobile ? 1 : 2}>
                        {currentMedias.map((media) => (
                            <MapMedia key={media.id} media={media} shareURL={generateShareURL(spot.id, media.id)} />
                        ))}
                    </KrakMasonry>
                    {currentQuery.isFetching && <KrakLoading />}
                </div>
            </InfiniteScroll>
        </ScrollBar>
    );
};

export default MapFullSpotMedias;
