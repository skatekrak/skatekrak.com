import React from 'react';

import CarouselModal from '@/components/pages/map/media/Carousel/CarouselModal';
import { Media } from '@krak/carrelage-client';
import { useMediaID } from '@/lib/hook/queryState';
import { trpc } from '@/server/trpc/utils';

type Props = {
    initialMediaId: string;
    hashtag: string;
};

const MapCustomMediaCarousel = ({ hashtag, initialMediaId }: Props) => {
    const { data: media, isLoading: mediaLoading } = trpc.media.getById.useQuery(
        { id: initialMediaId },
        { placeholderData: (prev) => prev, refetchOnMount: false, refetchOnReconnect: false, refetchOnWindowFocus: false },
    );

    return media && !mediaLoading && <MapCustomMediaCarouselContent hashtag={hashtag} media={media} />;
};

export default MapCustomMediaCarousel;

const MapCustomMediaCarouselContent = ({ hashtag, media }: { hashtag: string; media: Media }) => {
    const [, setMediaID] = useMediaID();

    const { data, isLoading } = trpc.media.getHashtagMediasAround.useQuery({
        hashtag,
        mediaCreatedAt: media.createdAt,
    });

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
