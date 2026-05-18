import React, { useEffect, useState } from 'react';

import type { Media } from '@krak/contracts';
import { useImgproxy } from '@krak/ui';

import VideoPlayer from '@/components/Ui/Player/VideoPlayer';
import { getMediaImageUrl } from '@/lib/media';
import { useMapStore } from '@/store/map';

export type MapMediaVideoPlayerProps = {
    media: Media;
    isPlaying: boolean;
};

const MapMediaVideoPlayer: React.FC<MapMediaVideoPlayerProps> = ({ media, isPlaying }) => {
    const setVideoPlaying = useMapStore((state) => state.setVideoPlaying);
    const [previewKey, setPreviewKey] = useState(0);
    const imgproxy = useImgproxy();

    const onReady = () => {
        setVideoPlaying(media.id);
    };

    useEffect(() => {
        if (!isPlaying) {
            setPreviewKey((key) => key + 1);
        }
    }, [isPlaying]);

    return (
        <VideoPlayer
            key={previewKey}
            playing={isPlaying}
            onReady={onReady}
            url={media.video!.url}
            light={media.image && imgproxy ? getMediaImageUrl(media.image, imgproxy.baseUrl) : undefined}
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
