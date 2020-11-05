import React from 'react';

import { Media } from 'lib/carrelageClient';

export type MapFullSpotPhotoProps = {
    media: Media;
};

const MapFullSpotPhoto: React.FC<MapFullSpotPhotoProps> = ({ media }) => {
    return (
        <figure key={media.id} className="map-full-spot-popup-main-photo-container">
            <img
                key={media.id}
                className="map-full-spot-popup-main-photo"
                src={media.image.url}
                alt={media.addedBy.username}
            />
            <figcaption className="map-full-spot-popup-main-photo-author">{media.addedBy.username}</figcaption>
        </figure>
    );
};

export default MapFullSpotPhoto;
