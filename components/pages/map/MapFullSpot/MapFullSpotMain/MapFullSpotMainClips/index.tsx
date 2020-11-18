import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import ScrollBar from 'components/Ui/Scrollbar';
import { Clip, Spot } from 'lib/carrelageClient';
import useSpotClips from 'lib/hook/carrelage/spot-clips';
import { KrakLoading } from 'components/Ui/Icons/Spinners';

import MapFullSpotMainClip from './MapFullSpotMainClip';
import { flatten } from 'lib/helpers';

export type MapFullSpotMainClipsProps = {
    clips: Clip[];
    spot: Spot;
};

const MapFullSpotMainClips = ({ clips: defaultClips, spot }: MapFullSpotMainClipsProps) => {
    const { isFetching, data, canFetchMore, fetchMore } = useSpotClips(spot.id, defaultClips);
    const clips = flatten(data);

    const getScrollParent = () => {
        const wrappers = document.getElementsByClassName('simplebar-content-wrapper');
        return wrappers[wrappers.length - 1] as HTMLElement;
    };

    return (
        <ScrollBar id="clip-scroll" maxHeight="100%">
            <InfiniteScroll
                pageStart={1}
                initialLoad={false}
                loadMore={() => {
                    if (canFetchMore) {
                        fetchMore();
                    }
                }}
                hasMore={!isFetching && canFetchMore}
                getScrollParent={getScrollParent}
                useWindow={false}
            >
                <div id="map-full-spot-popup-main">
                    <div id="map-full-spot-popup-main-clips">
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
