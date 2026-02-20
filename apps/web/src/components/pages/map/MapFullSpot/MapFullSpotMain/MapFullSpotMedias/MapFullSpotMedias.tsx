import React from 'react';
import { KrakLoading } from '@/components/Ui/Icons/Spinners';
import InfiniteScroll from '@/components/Ui/InfiniteScroll';
import ScrollBar from '@/components/Ui/Scrollbar';
import KrakMasonry from '@/components/Ui/Masonry';
import MapMedia from '@/components/pages/map/media/MapMedia';

import { Spot, Media } from '@krak/carrelage-client';
import useSpotMedias from '@/lib/hook/carrelage/spot-medias';
import { flatten } from '@/lib/helpers';
import { useSettingsStore } from '@/store/settings';

export type MapFullSpotMediasProps = {
    medias: Media[];
    spot: Spot;
};

const MapFullSpotMedias: React.FC<MapFullSpotMediasProps> = ({ medias: firstMedias, spot }) => {
    const isMobile = useSettingsStore((state) => state.isMobile);

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
                loadMore={() => {
                    if (hasNextPage) {
                        fetchNextPage();
                    }
                }}
                hasMore={hasNextPage && !isFetching}
                getScrollParent={getScrollParent}
            >
                <div className="block p-6 [&_.icon-loading-krak]:mx-auto [&_.icon-loading-krak]:mt-16 [&_.icon-loading-krak]:mb-8 tablet:p-12">
                    <KrakMasonry breakpointCols={isMobile ? 1 : 2}>
                        {medias.map((media) => (
                            <MapMedia key={media.id} media={media} shareURL={generateShareURL(spot.id, media.id)} />
                        ))}
                    </KrakMasonry>
                    {isFetching && <KrakLoading />}
                </div>
            </InfiniteScroll>
        </ScrollBar>
    );
};

export default MapFullSpotMedias;
