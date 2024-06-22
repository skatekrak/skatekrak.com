import React from 'react';

import CarouselModal from '@/components/pages/map/media/Carousel/CarouselModal';
import useMedia, { useHashtagMediasAround } from '@/shared/feudartifice/hooks/media';
import { Media } from '@krak/carrelage-client';
import { useMediaID } from '@/lib/hook/queryState';

type Props = {
    initialMediaId: string;
    hashtag: string;
};

const MapCustomMediaCarousel = ({ hashtag, initialMediaId }: Props) => {
    const { data: media, isLoading: mediaLoading } = useMedia(initialMediaId);

    return media && !mediaLoading && <MapCustomMediaCarouselContent hashtag={hashtag} media={media} />;
};

export default MapCustomMediaCarousel;

const MapCustomMediaCarouselContent = ({ hashtag, media }: { hashtag: string; media: Media }) => {
    const [, setMediaID] = useMediaID();

    const { data, isLoading } = useHashtagMediasAround(hashtag, media);

    return (
        <CarouselModal
            open={!!media}
            onClose={() => setMediaID(null)}
            isLoading={isLoading}
            carouselProps={{
                media,
                prevMedia: data?.prevMedia ?? null,
                nextMedia: data?.nextMedia ?? null,
            }}
        />
    );
};
