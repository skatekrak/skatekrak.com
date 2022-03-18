import React, { useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactPlayer from 'react-player';

import VideoPlayer from 'components/Ui/Player/VideoPlayer';
import MapFullSpotMediaOverlay from './MapFullSpotMediaOverlay';
import * as S from 'components/pages/map/MapFullSpot/MapFullSpotMain/MapFullSpotMain.styled';

import { RootState } from 'store/reducers';
import { setVideoPlaying } from 'store/map/actions';
import { Media } from 'lib/carrelageClient';

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
        <S.MapFullSpotMainMediaContainer key={media.id}>
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
        </S.MapFullSpotMainMediaContainer>
    );
};

export default MapFullSpotVideo;
