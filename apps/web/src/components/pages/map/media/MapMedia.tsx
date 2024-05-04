import React from 'react';

import MapMediaOverlay from './MapMediaOverlay';
import MapMediaShare from './MapMediaShare';
import * as S from './MapMedia.styled';

import { Media } from '@krak/carrelage-client';
import MapMediaVideoPlayer from './MapMediaVideoPlayer';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useAppDispatch } from '@/store/hook';
import { setVideoPlaying } from '@/store/map/slice';
import IconFullScreen from '@/components/Ui/Icons/IconFullScreen';
import { useMediaID } from '@/lib/hook/queryState';

export type MapMediaProps = {
    shareURL?: string;
    media: Media;
    isFromCustomMapFeed?: boolean;
};

const MapMedia = ({ shareURL, media, isFromCustomMapFeed = false }: MapMediaProps) => {
    const dispatch = useAppDispatch();
    const [, setMediaID] = useMediaID();

    const videoPlayingId = useSelector((state: RootState) => state.map.videoPlayingId);
    const isPlaying = videoPlayingId === media.id;

    const openCarousel = (mediaId: string) => {
        // Close video if opened
        dispatch(setVideoPlaying());
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
