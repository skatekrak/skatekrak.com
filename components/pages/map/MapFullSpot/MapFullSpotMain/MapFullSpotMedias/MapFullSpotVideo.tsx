import React, { useState } from 'react';

import { Media } from 'lib/carrelageClient';
import VideoPlayer from 'components/Ui/Player/VideoPlayer';

export type MapFullSpotVideoProps = {
    media: Media;
};

const MapFullSpotVideo: React.FC<MapFullSpotVideoProps> = ({ media }) => {
    const [isPlaying, setPlaying] = useState(false);
    const onReady = () => {
        setPlaying(true);
    };

    return (
        <figure key={media.id} className="map-full-spot-popup-main-photo-container">
            {media.video && (
                <VideoPlayer
                    playing={isPlaying}
                    onReady={onReady}
                    url={media.video.jpg}
                    light={media.image.url}
                    loop
                    controls
                />
            )}
        </figure>
    );
};

export default MapFullSpotVideo;
