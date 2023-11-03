import React from 'react';

import MapMediaOverlay from './MapMediaOverlay';
import MapMediaShare from './MapMediaShare';
import * as S from './MapMedia.styled';

import { Media } from 'lib/carrelageClient';
import MapMediaVideoPlayer from './MapMediaVideoPlayer';
import { useSelector } from 'react-redux';
import { RootState } from 'store';

export type MapMediaProps = {
    shareURL?: string;
    media: Media;
    isFromCustomMapFeed?: boolean;
};

const MapMedia = ({ shareURL, media, isFromCustomMapFeed = false }: MapMediaProps) => {
    const videoPlayingId = useSelector((state: RootState) => state.map.videoPlayingId);
    const isPlaying = videoPlayingId === media.id;

    return (
        <S.MapMediaContainer key={media.id}>
            {shareURL && <MapMediaShare url={shareURL} media={media} />}
            {media.type === 'video' && <MapMediaVideoPlayer media={media} isPlaying={isPlaying} />}
            {media.type === 'image' && <img key={media.id} src={media.image.jpg} alt={media.addedBy.username} />}
            {(media.type === 'image' || (media.type === 'video' && !isPlaying)) && (
                <MapMediaOverlay media={media} isFromCustomMapFeed={isFromCustomMapFeed} />
            )}
        </S.MapMediaContainer>
    );
};

export default MapMedia;
