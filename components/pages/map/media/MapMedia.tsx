import React from 'react';

import MapMediaOverlay from './MapMediaOverlay';
import MapMediaShare from './MapMediaShare';
import VideoPlayer, { VideoPlayerProps } from 'components/Ui/Player/VideoPlayer';
import * as S from './MapMedia.styled';

import { Media } from 'lib/carrelageClient';

export type MapMediaProps = {
    shareURL?: string;
    media: Media;
    videoParams?: VideoPlayerProps;
};

const MapMedia = ({ shareURL, media, videoParams }: MapMediaProps) => {
    return (
        <S.MapMediaContainer key={media.id}>
            {shareURL && <MapMediaShare url={shareURL} media={media} />}
            {media.type === 'video' && (
                <VideoPlayer
                    ref={videoParams.playerRef}
                    playing={videoParams.isPlaying}
                    onReady={videoParams.onReady}
                    url={media.video.jpg}
                    light={media.image.jpg}
                    videoSize={{
                        width: media.video.width,
                        height: media.video.height,
                    }}
                    loop
                    controls
                />
            )}
            {/* {media.type === 'image' && <img key={media.id} src={media.image.jpg} alt={media.addedBy.username} />} */}
            {media.type === 'image' && (
                <img key={media.id} src="/images/call-to-adventure/krak-basquiat.jpg" alt={media.addedBy.username} />
            )}
            {(media.type === 'image' || (media.type === 'video' && !videoParams.isPlaying)) && (
                <MapMediaOverlay media={media} />
            )}
        </S.MapMediaContainer>
    );
};

export default MapMedia;
