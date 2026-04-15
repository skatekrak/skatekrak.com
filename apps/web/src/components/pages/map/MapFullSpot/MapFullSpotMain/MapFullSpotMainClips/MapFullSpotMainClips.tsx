import { useInfiniteQuery } from '@tanstack/react-query';
import React from 'react';

import type { Spot } from '@krak/contracts';

import { KrakLoading } from '@/components/Ui/Icons/Spinners';
import InfiniteScroll from '@/components/Ui/InfiniteScroll';
import ScrollBar from '@/components/Ui/Scrollbar';
import { flatten } from '@/lib/helpers';
import { orpc } from '@/server/orpc/client';

import MapFullSpotMainClip from './MapFullSpotMainClip';

export type MapFullSpotMainClipsProps = {
    spot: Spot;
};

const MapFullSpotMainClips = ({ spot }: MapFullSpotMainClipsProps) => {
    const { isFetching, data, fetchNextPage, hasNextPage } = useInfiniteQuery(
        orpc.media.listClipsBySpot.infiniteOptions({
            input: (pageParam: Date | undefined) => ({ spotId: spot.id, limit: 20, cursor: pageParam }),
            initialPageParam: undefined,
            getNextPageParam: (lastPage) => {
                if (lastPage.length < 20) return undefined;
                const lastElement = lastPage[lastPage.length - 1];
                return lastElement?.createdAt ?? undefined;
            },
            refetchOnWindowFocus: false,
            refetchOnMount: false,
        }),
    );
    const clips = flatten(data?.pages ?? []);

    const getScrollParent = () => {
        const wrappers = document.getElementsByClassName('simplebar-content-wrapper');
        return wrappers[wrappers.length - 1] as HTMLElement;
    };

    return (
        <ScrollBar id="clip-scroll" maxHeight="100%">
            <InfiniteScroll
                loadMore={() => {
                    if (hasNextPage) {
                        fetchNextPage();
                    }
                }}
                hasMore={!isFetching && hasNextPage}
                getScrollParent={getScrollParent}
            >
                <div className="flex flex-col h-full">
                    <div className="flex flex-col grow p-6 tablet:p-12 laptop-l:p-20">
                        {clips.map((clip) => (
                            <MapFullSpotMainClip key={clip.id} clip={clip} />
                        ))}
                        {isFetching && <KrakLoading />}
                    </div>
                </div>
            </InfiniteScroll>
        </ScrollBar>
    );
};

export default MapFullSpotMainClips;
