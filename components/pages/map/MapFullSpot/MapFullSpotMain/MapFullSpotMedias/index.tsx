import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import ScrollBar from 'components/Ui/Scrollbar';

import { Spot, Media } from 'lib/carrelageClient';
import useSpotMedias from 'lib/hook/carrelage/spot-medias';
import { flatten } from 'lib/helpers';
import { KrakLoading } from 'components/Ui/Icons/Spinners';
import MapFullSpotVideo from './MapFullSpotVideo';
import MapFullSpotPhoto from './MapFullSpotPhoto';
import KrakMasonry from 'components/Ui/Masonry';

export type MapFullSpotMediasProps = {
    medias: Media[];
    spot: Spot;
};

const MapFullSpotMedias: React.FC<MapFullSpotMediasProps> = ({ medias: firstMedias, spot }) => {
    const { isFetching, data, hasNextPage, fetchNextPage } = useSpotMedias(spot.id, firstMedias);
    const medias = flatten(data.pages);

    const getScrollParent = () => {
        const wrappers = document.getElementsByClassName('simplebar-content-wrapper');
        return wrappers[wrappers.length - 1] as HTMLElement;
    };

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
                <div id="map-full-spot-popup-main-media">
                    <KrakMasonry breakpointCols={2}>
                        {medias.map((media) => {
                            if (media.type === 'video') {
                                return <MapFullSpotVideo key={media.id} media={media} />;
                            }
                            return <MapFullSpotPhoto key={media.id} media={media} />;
                        })}
                    </KrakMasonry>
                    {isFetching && <KrakLoading />}
                </div>
            </InfiniteScroll>
        </ScrollBar>
    );
};

export default MapFullSpotMedias;
