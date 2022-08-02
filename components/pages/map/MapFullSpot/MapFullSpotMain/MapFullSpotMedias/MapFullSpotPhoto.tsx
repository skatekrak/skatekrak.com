import React from 'react';

import MapFullSpotMediaOverlay from './MapFullSpotMediaOverlay';
import MapFullSpotMediaShare from './MapFullSpotMediaShare';
import * as S from 'components/pages/map/MapFullSpot/MapFullSpotMain/MapFullSpotMain.styled';

import { Media } from 'lib/carrelageClient';

export type MapFullSpotPhotoProps = {
    spotId: string;
    media: Media;
};

const MapFullSpotPhoto: React.FC<MapFullSpotPhotoProps> = ({ spotId, media }) => {
    return (
        <S.MapFullSpotMainMediaContainerPhoto key={media.id}>
            <MapFullSpotMediaShare spotId={spotId} media={media} />
            <img key={media.id} src={media.image.jpg} alt={media.addedBy.username} />
            <MapFullSpotMediaOverlay media={media} />
        </S.MapFullSpotMainMediaContainerPhoto>
    );
};

export default MapFullSpotPhoto;
