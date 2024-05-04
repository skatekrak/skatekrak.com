import React from 'react';
import { useShallow } from 'zustand/react/shallow';

import MapMediaOverlay from './MapMediaOverlay';
import MapMediaShare from './MapMediaShare';
import * as S from './MapMedia.styled';

import { Media } from '@krak/carrelage-client';
import MapMediaVideoPlayer from './MapMediaVideoPlayer';
import IconFullScreen from '@/components/Ui/Icons/IconFullScreen';
import { useMediaID } from '@/lib/hook/queryState';
import { useMapStore } from '@/store/map';

export type MapMediaProps = {
    shareURL?: string;
    media: Media;
    isFromCustomMapFeed?: boolean;
};

const MapMedia = ({ shareURL, media, isFromCustomMapFeed = false }: MapMediaProps) => {
    const [videoPlayingId, setVideoPlaying] = useMapStore(
        useShallow((state) => [state.videoPlayingId, state.setVideoPlaying]),
    );
    const [, setMediaID] = useMediaID();

    const isPlaying = videoPlayingId === media.id;

    const openCarousel = (mediaId: string) => {
        // Close video if opened
        setVideoPlaying(null);
        setMediaID(mediaId);
    };

    return (
        <S.MapMediaContainer key={media.id}>
            {shareURL && <MapMediaShare url={shareURL} media={media} />}

            <S.OpenCarouselButton onClick={() => openCarousel(media.id)}>
                <IconFullScreen />
            </S.OpenCarouselButton>
            {media.type === 'video' && <MapMediaVideoPlayer media={media} isPlaying={isPlaying} />}
            {media.type === 'image' && <img key={media.id} src={media.image.jpg} alt={media.addedBy.username} />}
            {(media.type === 'image' || (media.type === 'video' && !isPlaying)) && (
                <MapMediaOverlay media={media} isFromCustomMapFeed={isFromCustomMapFeed} />
            )}
        </S.MapMediaContainer>
    );
};

export default MapMedia;
