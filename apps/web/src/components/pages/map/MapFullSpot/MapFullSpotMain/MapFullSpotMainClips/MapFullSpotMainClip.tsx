import React, { useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { useShallow } from 'zustand/react/shallow';

import VideoPlayer from '@/components/Ui/Player/VideoPlayer';
import * as S from '@/components/pages/map/MapFullSpot/MapFullSpotMain/MapFullSpotMain.styled';

import { Clip } from '@krak/carrelage-client';
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
        <S.MapFullSpotMainClip>
            <S.MapFullSpotMainClipTitle component="heading6">{clip.title}</S.MapFullSpotMainClipTitle>
            <VideoPlayer
                ref={playerRef}
                playing={isPlaying}
                onReady={onReady}
                url={clip.videoURL}
                light={clip.thumbnailURL}
                controls
                playIcon={clip.provider === 'vimeo' ? () => <></> : undefined} // Remove play icon on Vimeo as there is already one in the thumbnail
            />
        </S.MapFullSpotMainClip>
    );
};

export default React.memo(MapFullSpotMainClip);
