import React, { useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactPlayer from 'react-player';

import VideoPlayer from '@/components/Ui/Player/VideoPlayer';
import * as S from '@/components/pages/map/MapFullSpot/MapFullSpotMain/MapFullSpotMain.styled';

import { setVideoPlaying } from '@/store/map/slice';
import { Clip } from '@krak/carrelage-client';
import { RootState } from '@/store';

type MapFullSpotMainClipProps = {
    clip: Clip;
};

const MapFullSpotMainClip = ({ clip }: MapFullSpotMainClipProps) => {
    const dispatch = useDispatch();
    const videoPlayingId = useSelector((state: RootState) => state.map.videoPlayingId);
    const isPlaying = useMemo(() => videoPlayingId === clip.id, [videoPlayingId, clip.id]);
    const playerRef = useRef<ReactPlayer>(null);

    const onReady = () => {
        dispatch(setVideoPlaying(clip.id));
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
