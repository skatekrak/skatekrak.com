import React from 'react';

import CarouselModal from '@/components/pages/map/media/Carousel/CarouselModal';
import useMedia, { useHashtagMediasAround } from '@/shared/feudartifice/hooks/media';
import { Media } from '@krak/carrelage-client';
import { useMediaID } from '@/lib/hook/queryState';

type Props = {
    initialMediaId: string;
    hashtag: string;
};

const MapCustomNavigationMediaCarousel = ({ hashtag, initialMediaId }: Props) => {
    const { data: media, isLoading: mediaLoading } = useMedia(initialMediaId);

    return media && !mediaLoading && <MapCustomNavigationMediaCarouselContent hashtag={hashtag} media={media} />;
};

export default MapCustomNavigationMediaCarousel;

const MapCustomNavigationMediaCarouselContent = ({ hashtag, media }: { hashtag: string; media: Media }) => {
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
