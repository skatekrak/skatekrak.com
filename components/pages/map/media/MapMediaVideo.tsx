import React, { useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactPlayer from 'react-player';

import { RootState } from 'store';
import { setVideoPlaying } from 'store/map/slice';
import { Media } from 'lib/carrelageClient';
import MapMedia from 'components/pages/map/media/MapMedia';

export type MapMediaVideoProps = {
    shareURL?: string;
    media: Media;
};

const MapMediaVideo: React.FC<MapMediaVideoProps> = ({ shareURL, media }) => {
    const dispatch = useDispatch();
    const videoPlayingId = useSelector((state: RootState) => state.map.videoPlayingId);
    const isPlaying = useMemo(() => videoPlayingId === media.id, [videoPlayingId, media.id]);
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
        <MapMedia
            shareURL={shareURL}
            media={media}
            videoParams={{
                ref: playerRef,
                isPlaying,
                onReady,
            }}
        />
    );
};

export default MapMediaVideo;
