import React from 'react';

import ScrollBar from 'components/Ui/Scrollbar';

import { Spot } from 'lib/carrelageClient';

export type MapFullSpotPhotosProps = {
    photos: any;
    spot: Spot;
};

const MapFullSpotPhotos: React.FC<MapFullSpotPhotosProps> = ({ spot, photos }) => {
    return (
        <ScrollBar maxHeight="100%">
            <div id="map-full-spot-popup-main-photos">
                {photos.map((photo) => (
                    <figure key={photo.id} className="map-full-spot-popup-main-photo-container">
                        <img
                            key={photo.id}
                            className="map-full-spot-popup-main-photo"
                            src={photo.image.url}
                            alt={photo.addedBy.username}
                        />
                        <figcaption className="map-full-spot-popup-main-photo-author">
                            {photo.addedBy.username}
                        </figcaption>
                    </figure>
                ))}
            </div>
        </ScrollBar>
    );
};

export default MapFullSpotPhotos;
