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
        <div key={media.id} className="map-full-spot-popup-main-media-container">
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
            <div className="map-full-spot-popup-main-media-overlay">
                <h5 className="map-full-spot-popup-main-media-overlay-author">{media.addedBy.username}</h5>
                <p className="map-full-spot-popup-main-media-overlay-caption">
                    Une description a faire rougir jean michel redaction. La plus longue qu'on puisse trouver dans l'app
                    je te dis. Toujours pas assez longue a prioris. Abusssss
                </p>
            </div>
        </div>
    );
};

export default MapFullSpotVideo;
