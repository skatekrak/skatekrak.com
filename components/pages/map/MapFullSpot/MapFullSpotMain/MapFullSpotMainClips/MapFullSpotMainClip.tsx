import React, { useEffect, useMemo, useRef } from 'react';

import { Clip } from 'lib/carrelageClient';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/reducers';
import VideoPlayer from 'components/Ui/Player/VideoPlayer';
import ReactPlayer from 'react-player';
import { setVideoPlaying } from 'store/map/actions';

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
        <div className="map-full-spot-popup-main-clip">
            <h2 className="map-full-spot-popup-main-clip-title">{clip.title}</h2>
            <VideoPlayer
                ref={playerRef}
                playing={isPlaying}
                onReady={onReady}
                url={clip.videoURL}
                light={clip.thumbnailURL}
                controls
                playIcon={clip.provider === 'vimeo' ? () => <></> : undefined} // Remove play icon on Vimeo as there is already one in the thumbnail
            />
        </div>
    );
};

export default React.memo(MapFullSpotMainClip);
