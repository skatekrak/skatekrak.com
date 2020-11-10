import React from 'react';

import { Media } from 'lib/carrelageClient';

export type MapFullSpotPhotoProps = {
    media: Media;
};

const MapFullSpotPhoto: React.FC<MapFullSpotPhotoProps> = ({ media }) => {
    return (
        <div
            key={media.id}
            className="map-full-spot-popup-main-media-container  map-full-spot-popup-main-media-container-photo"
        >
            <img
                key={media.id}
                className="map-full-spot-popup-main-media"
                src={media.image.url}
                alt={media.addedBy.username}
            />
            <div className="map-full-spot-popup-main-media-overlay">
                <h5 className="map-full-spot-popup-main-media-overlay-author">{media.addedBy.username}</h5>
                <p className="map-full-spot-popup-main-media-overlay-caption">
                    Une description a faire rougir jean michel redaction. La plus longue qu'on puisse trouver dans l'app
                    je te dis.
                </p>
            </div>
        </div>
    );
};

export default MapFullSpotPhoto;
