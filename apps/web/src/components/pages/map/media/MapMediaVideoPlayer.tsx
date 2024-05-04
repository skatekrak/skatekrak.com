import React, { useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';

import { Media } from '@krak/carrelage-client';
import VideoPlayer from '@/components/Ui/Player/VideoPlayer';
import { useMapStore } from '@/store/map';

export type MapMediaVideoPlayerProps = {
    media: Media;
    isPlaying: boolean;
};

const MapMediaVideoPlayer: React.FC<MapMediaVideoPlayerProps> = ({ media, isPlaying }) => {
    const setVideoPlaying = useMapStore((state) => state.setVideoPlaying);
    const playerRef = useRef<ReactPlayer>(null);

    const onReady = () => {
        setVideoPlaying(media.id);
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
