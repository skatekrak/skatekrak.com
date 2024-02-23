import React from 'react';
import { useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';

import { KrakLoading } from 'components/Ui/Icons/Spinners';
import ScrollBar from 'components/Ui/Scrollbar';
import KrakMasonry from 'components/Ui/Masonry';
import MapMedia from 'components/pages/map/media/MapMedia';
import * as S from 'components/pages/map/MapFullSpot/MapFullSpotMain/MapFullSpotMain.styled';

import { Spot, Media } from 'lib/carrelageClient';
import useSpotMedias from 'lib/hook/carrelage/spot-medias';
import { flatten } from 'lib/helpers';
import { RootState } from 'store';

export type MapFullSpotMediasProps = {
    medias: Media[];
    spot: Spot;
};

const MapFullSpotMedias: React.FC<MapFullSpotMediasProps> = ({ medias: firstMedias, spot }) => {
    const isMobile = useSelector((state: RootState) => state.settings.isMobile);

    const { isFetching, data, hasNextPage, fetchNextPage } = useSpotMedias(spot.id, firstMedias);
    const medias = flatten(data?.pages ?? []);

    const getScrollParent = () => {
        const wrappers = document.getElementsByClassName('simplebar-content-wrapper');
        return wrappers[wrappers.length - 1] as HTMLElement;
    };

    const generateShareURL = (spotId: string, mediaId: string) =>
        `${window.location.origin}?modal=1&spot=${spotId}&media=${mediaId}`;

    return (
        <ScrollBar maxHeight="100%">
            <InfiniteScroll
                pageStart={1}
                initialLoad={true}
                loadMore={() => {
                    if (hasNextPage) {
                        fetchNextPage();
                    }
                }}
                hasMore={hasNextPage && !isFetching}
                getScrollParent={getScrollParent}
                useWindow={false}
            >
                <S.MapFullSpotMainMediaGridContainer>
                    <KrakMasonry breakpointCols={isMobile ? 1 : 2}>
                        {medias.map((media) => (
                            <MapMedia key={media.id} media={media} shareURL={generateShareURL(spot.id, media.id)} />
                        ))}
                    </KrakMasonry>
                    {isFetching && <KrakLoading />}
                </S.MapFullSpotMainMediaGridContainer>
            </InfiniteScroll>
        </ScrollBar>
    );
};

export default MapFullSpotMedias;
