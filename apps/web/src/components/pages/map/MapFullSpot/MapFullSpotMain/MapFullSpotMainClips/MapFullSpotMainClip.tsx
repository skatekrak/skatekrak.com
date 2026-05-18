import React, { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import type { Clip } from '@krak/contracts';

import VideoPlayer from '@/components/Ui/Player/VideoPlayer';
import Typography from '@/components/Ui/typography/Typography';
import { useMapStore } from '@/store/map';

type MapFullSpotMainClipProps = {
    clip: Clip;
};

const MapFullSpotMainClip = ({ clip }: MapFullSpotMainClipProps) => {
    const [videoPlayingId, setVideoPlaying] = useMapStore(
        useShallow((state) => [state.videoPlayingId, state.setVideoPlaying]),
    );
    const isPlaying = videoPlayingId === clip.id;
    const [previewKey, setPreviewKey] = useState(0);

    const onReady = () => {
        setVideoPlaying(clip.id);
    };

    useEffect(() => {
        if (!isPlaying) {
            setPreviewKey((key) => key + 1);
        }
    }, [isPlaying]);

    return (
        <div className="mb-8 last:mb-0 tablet:mb-16">
            <Typography className="mb-4" component="heading6">
                {clip.title}
            </Typography>
            <VideoPlayer key={previewKey} playing={isPlaying} onReady={onReady} url={clip.videoURL} light controls />
        </div>
    );
};

export default React.memo(MapFullSpotMainClip);
