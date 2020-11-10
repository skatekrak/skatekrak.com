import React from 'react';

import { Media } from 'lib/carrelageClient';
import MapFullSpotMediaOverlay from './MapFullSpotMediaOverlay';

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
            <MapFullSpotMediaOverlay media={media} />
        </div>
    );
};

export default MapFullSpotPhoto;
