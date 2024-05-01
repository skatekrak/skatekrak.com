import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import ScrollBar from '@/components/Ui/Scrollbar';
import { KrakLoading } from '@/components/Ui/Icons/Spinners';
import MapFullSpotMainClip from './MapFullSpotMainClip';
import * as S from '@/components/pages/map/MapFullSpot/MapFullSpotMain/MapFullSpotMain.styled';

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
                pageStart={1}
                initialLoad={false}
                loadMore={() => {
                    if (hasNextPage) {
                        fetchNextPage();
                    }
                }}
                hasMore={!isFetching && hasNextPage}
                getScrollParent={getScrollParent}
                useWindow={false}
            >
                <S.MapFullSpotMainContainer>
                    <S.MapFullSpotMainClips>
                        {clips.map((clip) => (
                            <MapFullSpotMainClip key={clip.id} clip={clip} />
                        ))}
                        {isFetching && <KrakLoading />}
                    </S.MapFullSpotMainClips>
                </S.MapFullSpotMainContainer>
            </InfiniteScroll>
        </ScrollBar>
    );
};

export default MapFullSpotMainClips;
