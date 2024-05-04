import React from 'react';

import Carousel from '../../media/Carousel';
import IconArrowHead from '@/components/Ui/Icons/ArrowHead';
import * as S from './MapFullSpotCarousel.styled';

import useMedia from '@/shared/feudartifice/hooks/media';
import { KrakLoading } from '@/components/Ui/Icons/Spinners';
import { Spot, Media } from '@krak/carrelage-client';
import { useSpotMediasAround } from '@/lib/hook/carrelage/spot-medias';
import { useMediaID } from '@/lib/hook/queryState';

type Props = {
    initialMediaId: string;
    spot: Spot;
};

const MapFullSpotCarousel = ({ initialMediaId, spot }: Props) => {
    const { data: media, isLoading: mediaLoading } = useMedia(initialMediaId);

    return (
        <S.CarouselContainer>
            {mediaLoading && <KrakLoading />}
            {!mediaLoading && media != null && <MapFullSpotCarouselContent spot={spot} media={media} />}
        </S.CarouselContainer>
    );
};

const MapFullSpotCarouselContent = ({ spot, media }: { spot: Spot; media: Media }) => {
    const [, setMediaID] = useMediaID();

    const { data } = useSpotMediasAround(spot.id, media);

    const goBackToSpot = () => {
        setMediaID(null);
    };

    return (
        <Carousel
            media={media}
            prevMedia={data?.prevMedia ?? null}
            nextMedia={data?.nextMedia ?? null}
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
