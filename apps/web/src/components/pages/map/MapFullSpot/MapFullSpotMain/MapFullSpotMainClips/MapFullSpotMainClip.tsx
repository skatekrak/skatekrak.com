import React, { useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { useShallow } from 'zustand/react/shallow';

import VideoPlayer from '@/components/Ui/Player/VideoPlayer';
import Typography from '@/components/Ui/typography/Typography';

import type { Clip } from '@krak/contracts';
import { useMapStore } from '@/store/map';

type MapFullSpotMainClipProps = {
    clip: Clip;
};

const MapFullSpotMainClip = ({ clip }: MapFullSpotMainClipProps) => {
    const [videoPlayingId, setVideoPlaying] = useMapStore(
        useShallow((state) => [state.videoPlayingId, state.setVideoPlaying]),
    );
    const isPlaying = videoPlayingId === clip.id;
    const playerRef = useRef<ReactPlayer>(null);

    const onReady = () => {
        setVideoPlaying(clip.id);
    };

    useEffect(() => {
        if (!isPlaying && playerRef.current) {
            playerRef.current.showPreview();
        }
    }, [isPlaying]);

    return (
        <div className="mb-8 last:mb-0 tablet:mb-16">
            <Typography className="mb-4" component="heading6">
                {clip.title}
            </Typography>
            <VideoPlayer ref={playerRef} playing={isPlaying} onReady={onReady} url={clip.videoURL} light controls />
        </div>
    );
};

export default React.memo(MapFullSpotMainClip);
