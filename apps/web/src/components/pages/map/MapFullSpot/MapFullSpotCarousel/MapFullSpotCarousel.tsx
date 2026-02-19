import React from 'react';

import Carousel from '../../media/Carousel';
import IconArrowHead from '@/components/Ui/Icons/ArrowHead';

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
        <div className="absolute inset-0 flex z-10">
            {mediaLoading && <KrakLoading />}
            {!mediaLoading && media != null && <MapFullSpotCarouselContent spot={spot} media={media} />}
        </div>
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
                <button className="flex items-center text-onDark-mediumEmphasis underline text-sm [&_svg]:w-[1.125rem] [&_svg]:mr-1 [&_svg]:mt-px [&_svg]:fill-onDark-mediumEmphasis [&_svg]:rotate-180 hover:text-onDark-highEmphasis hover:[&_svg]:fill-onDark-highEmphasis" onClick={goBackToSpot}>
                    <IconArrowHead />
                    <span>{spot.name}</span>
                </button>
            }
        />
    );
};

export default MapFullSpotCarousel;
