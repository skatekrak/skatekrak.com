import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import ReactPlayer from 'react-player';

import { setVideoPlaying } from 'store/map/slice';
import { Media } from 'lib/carrelageClient';
import VideoPlayer from 'components/Ui/Player/VideoPlayer';

export type MapMediaVideoPlayerProps = {
    media: Media;
    isPlaying: boolean;
};

const MapMediaVideoPlayer: React.FC<MapMediaVideoPlayerProps> = ({ media, isPlaying }) => {
    const dispatch = useDispatch();
    const playerRef = useRef<ReactPlayer>(null);

    const onReady = () => {
        dispatch(setVideoPlaying(media.id));
    };

    useEffect(() => {
        if (!isPlaying && playerRef.current) {
            playerRef.current.showPreview();
        }
    }, [isPlaying]);

    return (
        <VideoPlayer
            ref={playerRef}
            playing={isPlaying}
            onReady={onReady}
            url={media.video!.jpg}
            light={media.image.jpg}
            videoSize={{
                width: media.video!.width,
                height: media.video!.height,
            }}
            loop
            controls
        />
    );
};

export default MapMediaVideoPlayer;
