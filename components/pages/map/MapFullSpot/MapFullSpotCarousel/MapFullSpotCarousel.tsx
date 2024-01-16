import React from 'react';

import Carousel from '../../media/Carousel';
import IconArrowHead from 'components/Ui/Icons/ArrowHead';
import * as S from './MapFullSpotCarousel.styled';

import useSpotMedias from 'lib/hook/carrelage/spot-medias';
import useMedia from 'shared/feudartifice/hooks/media';
import { flatten } from 'lib/helpers';
import { KrakLoading } from 'components/Ui/Icons/Spinners';
import { useAppDispatch } from 'store/hook';
import { updateUrlParams } from 'store/map/slice';
import { Spot, Media } from 'lib/carrelageClient';

type Props = {
    initialMediaId: string;
    spot: Spot;
};

const MapFullSpotCarousel = ({ initialMediaId, spot }: Props) => {
    const { data: media, isLoading: mediaLoading } = useMedia(initialMediaId);

    return (
        <S.CarouselContainer>
            {mediaLoading ? <KrakLoading /> : <InternalMapFullSpotCarousel spot={spot} media={media} />}
        </S.CarouselContainer>
    );
};

const InternalMapFullSpotCarousel = ({ spot, media }: { spot: Spot; media: Media }) => {
    const dispatch = useAppDispatch();
    const { data, isLoading, hasNextPage, fetchNextPage, hasPreviousPage, fetchPreviousPage } = useSpotMedias(
        spot.id,
        [media],
        'carousel' + media.id,
    );

    const medias = flatten(data?.pages ?? []);

    const loadMore = (key: 'previous' | 'next') => {
        if (key === 'next' && hasNextPage) {
            fetchNextPage();
        }
        if (key === 'previous' && hasPreviousPage) {
            fetchPreviousPage();
        }
    };

    const goBackToSpot = () => {
        dispatch(updateUrlParams({ mediaId: null }));
    };

    if (isLoading) return <KrakLoading />;

    return (
        <Carousel
            initialMediaId={media.id}
            medias={medias}
            loadMore={loadMore}
            onMediaChange={(id) => dispatch(updateUrlParams({ mediaId: id }))}
            additionalActions={
                <S.AdditionalActions onClick={goBackToSpot}>
                    <IconArrowHead />
                    <span>{spot.name}</span>
                </S.AdditionalActions>
            }
        />
    );
};

export default MapFullSpotCarousel;
