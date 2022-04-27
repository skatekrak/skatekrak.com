import React from 'react';

import { Media } from 'lib/carrelageClient';
import MapFullSpotMediaOverlay from './MapFullSpotMediaOverlay';
import * as S from 'components/pages/map/MapFullSpot/MapFullSpotMain/MapFullSpotMain.styled';

export type MapFullSpotPhotoProps = {
    media: Media;
};

const MapFullSpotPhoto: React.FC<MapFullSpotPhotoProps> = ({ media }) => {
    return (
        <S.MapFullSpotMainMediaContainerPhoto key={media.id}>
            <img
                key={media.id}
                className="map-full-spot-popup-main-media"
                src={media.image.jpg}
                alt={media.addedBy.username}
            />
            <MapFullSpotMediaOverlay media={media} />
        </S.MapFullSpotMainMediaContainerPhoto>
    );
};

export default MapFullSpotPhoto;
