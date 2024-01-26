import React from 'react';

import Carousel from '../../media/Carousel';
import IconArrowHead from 'components/Ui/Icons/ArrowHead';
import * as S from './MapFullSpotCarousel.styled';

import useMedia from 'shared/feudartifice/hooks/media';
import { KrakLoading } from 'components/Ui/Icons/Spinners';
import { useAppDispatch } from 'store/hook';
import { updateUrlParams } from 'store/map/slice';
import { Spot, Media } from 'lib/carrelageClient';
import { CarouselProvider } from '../../media/Carousel/CarouselContext';

type Props = {
    initialMediaId: string;
    spot: Spot;
};

const MapFullSpotCarousel = ({ initialMediaId, spot }: Props) => {
    const { data: media, isLoading: mediaLoading } = useMedia(initialMediaId);

    return (
        <S.CarouselContainer>
            {mediaLoading ? <KrakLoading /> : <MapFullSpotCarouselContent spot={spot} media={media} />}
        </S.CarouselContainer>
    );
};

const MapFullSpotCarouselContent = ({ spot, media }: { spot: Spot; media: Media }) => {
    const dispatch = useAppDispatch();

    const goBackToSpot = () => {
        dispatch(updateUrlParams({ mediaId: null }));
    };

    return (
        <CarouselProvider media={media} spot={spot}>
            <Carousel
                additionalActions={
                    <S.AdditionalActions onClick={goBackToSpot}>
                        <IconArrowHead />
                        <span>{spot.name}</span>
                    </S.AdditionalActions>
                }
            />
        </CarouselProvider>
    );
};

export default MapFullSpotCarousel;
