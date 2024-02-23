import React from 'react';

import CarouselModal from 'components/pages/map/media/Carousel/CarouselModal';
import { useAppDispatch } from 'store/hook';
import { updateUrlParams } from 'store/map/slice';
import useMedia, { useHashtagMediasAround } from 'shared/feudartifice/hooks/media';
import { Media } from 'lib/carrelageClient';

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
    const dispatch = useAppDispatch();

    const { data, isLoading } = useHashtagMediasAround(hashtag, media);

    return (
        <CarouselModal
            open={!!media}
            onClose={() => dispatch(updateUrlParams({ mediaId: null }))}
            isLoading={isLoading}
            carouselProps={{
                media,
                prevMedia: data?.prevMedia,
                nextMedia: data?.nextMedia,
            }}
        />
    );
};
