import React, { useMemo } from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import MapMedia from '@/components/pages/map/media/MapMedia';
import { KrakLoading } from '@/components/Ui/Icons/Spinners';

import { flatten } from '@/lib/helpers';
import { useInfiniteMedias } from '@/shared/feudartifice/hooks/media';

import * as S from './MapCustomNavigationMediaFeed.styled';
import MapCustomNavigationMediaCarousel from '@/components/pages/map/MapCustom/MapCustomNavigation/MapCustomNavigationMediaFeed/MapCustomNavigationMediaCarousel';
import { useMediaID } from '@/lib/hook/queryState';

type Props = {
    mapId: string;
};

const MapCustomNavigationMediaFeed = ({ mapId }: Props) => {
    const today = useMemo(() => {
        return new Date();
    }, []);

    const { isFetching, data, hasNextPage, fetchNextPage } = useInfiniteMedias({
        older: today,
        limit: 10,
        hashtag: mapId,
    });

    const infiniteMedias = flatten(data?.pages ?? []);

    const getScrollParent = () => {
        const wrappers = document.getElementsByClassName('simplebar-content-wrapper');
        return wrappers[wrappers.length - 1] as HTMLElement;
    };

    const [mediaId] = useMediaID();

    return (
        <div>
            {mediaId && <MapCustomNavigationMediaCarousel initialMediaId={mediaId} hashtag={mapId} />}
            <InfiniteScroll
                pageStart={1}
                initialLoad={true}
                loadMore={() => {
                    console.log(hasNextPage);
                    if (hasNextPage) {
                        fetchNextPage();
                    }
                }}
                hasMore={hasNextPage && !isFetching}
                getScrollParent={getScrollParent}
                useWindow={false}
            >
                <S.MapCustomNavigationMediaFeedContainer>
                    {infiniteMedias.map((media) => (
                        <MapMedia key={media.id} media={media} isFromCustomMapFeed />
                    ))}
                    {isFetching && <KrakLoading />}
                </S.MapCustomNavigationMediaFeedContainer>
            </InfiniteScroll>
        </div>
    );
};

export default MapCustomNavigationMediaFeed;
