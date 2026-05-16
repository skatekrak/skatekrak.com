import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { Spot, Media } from '@krak/contracts';

import { KrakLoading } from '@/components/Ui/Icons/Spinners';
import { orpc } from '@/server/orpc/client';

import Carousel from '../../media/Carousel';

type Props = {
    initialMediaId: string;
    spot: Spot;
};

const MapFullSpotCarousel = ({ initialMediaId, spot }: Props) => {
    const { data: media, isLoading: mediaLoading } = useQuery(
        orpc.media.getById.queryOptions({
            input: { id: initialMediaId },
            placeholderData: (prev) => prev,
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
        }),
    );

    return (
        <div className="absolute inset-0 flex z-10">
            {mediaLoading && <KrakLoading />}
            {!mediaLoading && media != null && <MapFullSpotCarouselContent spot={spot} media={media} />}
        </div>
    );
};

const MapFullSpotCarouselContent = ({ spot, media }: { spot: Spot; media: Media }) => {
    const { data } = useQuery(
        orpc.media.getSpotMediasAround.queryOptions({
            input: {
                spotId: spot.id,
                mediaCreatedAt: media.createdAt,
            },
        }),
    );

    return <Carousel media={media} prevMedia={data?.prevMedia ?? null} nextMedia={data?.nextMedia ?? null} />;
};

export default MapFullSpotCarousel;
