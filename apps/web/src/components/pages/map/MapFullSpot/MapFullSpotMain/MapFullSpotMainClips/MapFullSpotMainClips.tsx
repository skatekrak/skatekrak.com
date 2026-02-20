import React from 'react';
import ScrollBar from '@/components/Ui/Scrollbar';
import InfiniteScroll from '@/components/Ui/InfiniteScroll';
import { KrakLoading } from '@/components/Ui/Icons/Spinners';
import MapFullSpotMainClip from './MapFullSpotMainClip';

import { flatten } from '@/lib/helpers';
import { Spot } from '@krak/carrelage-client';
import useSpotClips from '@/lib/hook/carrelage/spot-clips';

export type MapFullSpotMainClipsProps = {
    spot: Spot;
};

const MapFullSpotMainClips = ({ spot }: MapFullSpotMainClipsProps) => {
    const { isFetching, data, fetchNextPage, hasNextPage } = useSpotClips(spot.id);
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
