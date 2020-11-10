import React, { useEffect, useMemo, useRef } from 'react';

import { Media } from 'lib/carrelageClient';
import VideoPlayer from 'components/Ui/Player/VideoPlayer';
import MapFullSpotMediaOverlay from './MapFullSpotMediaOverlay';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store/reducers';
import { setVideoPlaying } from 'store/map/actions';
import ReactPlayer from 'react-player';

export type MapFullSpotVideoProps = {
    media: Media;
};

const MapFullSpotVideo: React.FC<MapFullSpotVideoProps> = ({ media }) => {
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
        <div key={media.id} className="map-full-spot-popup-main-media-container">
            {media.video && (
                <VideoPlayer
                    ref={playerRef}
                    playing={isPlaying}
                    onReady={onReady}
                    url={media.video.jpg}
                    light={media.image.jpg}
                    loop
                    controls
                />
            )}
            {!isPlaying && <MapFullSpotMediaOverlay media={media} />}
        </div>
    );
};

export default MapFullSpotVideo;
