import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { Media } from '@krak/contracts';

import CarouselModal from '@/components/pages/map/media/Carousel/CarouselModal';
import { useMediaID } from '@/lib/hook/queryState';
import { orpc } from '@/server/orpc/client';

type Props = {
    initialMediaId: string;
    hashtag: string;
};

const MapCustomMediaCarousel = ({ hashtag, initialMediaId }: Props) => {
    const { data: media, isLoading: mediaLoading } = useQuery(
        orpc.media.getById.queryOptions({
            input: { id: initialMediaId },
            placeholderData: (prev) => prev,
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
        }),
    );

    return media && !mediaLoading && <MapCustomMediaCarouselContent hashtag={hashtag} media={media} />;
};

export default MapCustomMediaCarousel;

const MapCustomMediaCarouselContent = ({ hashtag, media }: { hashtag: string; media: Media }) => {
    const [, setMediaID] = useMediaID();

    const { data, isLoading } = useQuery(
        orpc.media.getHashtagMediasAround.queryOptions({
            input: {
                hashtag,
                mediaCreatedAt: media.createdAt,
            },
        }),
    );

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
