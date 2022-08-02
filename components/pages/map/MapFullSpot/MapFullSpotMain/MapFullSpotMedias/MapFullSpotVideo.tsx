import React, { useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactPlayer from 'react-player';

import SocialShare from 'components/Ui/share/SocialShare';
import VideoPlayer from 'components/Ui/Player/VideoPlayer';
import MapFullSpotMediaOverlay from './MapFullSpotMediaOverlay';
import * as S from 'components/pages/map/MapFullSpot/MapFullSpotMain/MapFullSpotMain.styled';

import { RootState } from 'store';
import { setVideoPlaying } from 'store/map/slice';
import { Media } from 'lib/carrelageClient';
import MapFullSpotMediaShare from './MapFullSpotMediaShare';

export type MapFullSpotVideoProps = {
    spotId: string;
    media: Media;
};

const MapFullSpotVideo: React.FC<MapFullSpotVideoProps> = ({ spotId, media }) => {
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
        <S.MapFullSpotMainMediaContainerVideo key={media.id}>
            <MapFullSpotMediaShare spotId={spotId} media={media} />
            {media.video && (
                <VideoPlayer
                    ref={playerRef}
                    playing={isPlaying}
                    onReady={onReady}
                    url={media.video.jpg}
                    light={media.image.jpg}
                    videoSize={{
                        width: media.video.width,
                        height: media.video.height,
                    }}
                    loop
                    controls
                />
            )}
            {!isPlaying && <MapFullSpotMediaOverlay media={media} />}
        </S.MapFullSpotMainMediaContainerVideo>
    );
};

export default MapFullSpotVideo;
