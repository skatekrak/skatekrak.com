import React from 'react';
import { Media } from 'lib/carrelageClient';

const MapFullSpotMediaOverlay = ({ media }: { media: Media }) => (
    <div className="map-full-spot-popup-main-media-overlay">
        <h5 className="map-full-spot-popup-main-media-overlay-author">{media.addedBy.username}</h5>
        {media.caption != null && <p className="map-full-spot-popup-main-media-overlay-caption">{media.caption}</p>}
    </div>
);

export default MapFullSpotMediaOverlay;
