import React from 'react';

import PlaceIcon from 'components/pages/map/marker/icons/Place';
import * as S from './MapSearchResults.styled';

import { Place } from 'lib/placeApi';

type Props = {
    place: Place;
    onPlaceClick: (place: Place) => void;
};

const MapSearchResultSpot = ({ place, onPlaceClick }: Props) => {
    const handlePlaceClick = () => {
        onPlaceClick(place);
    };

    return (
        <>
            <S.MapSearchResultPlace onClick={handlePlaceClick}>
                <S.MapSearchResultSpotIcon>
                    <PlaceIcon />
                </S.MapSearchResultSpotIcon>
                <S.MapSearchResultSpotMain>
                    <S.MapSearchResultSpotName truncateLines={1}>{place.name}</S.MapSearchResultSpotName>
                </S.MapSearchResultSpotMain>
            </S.MapSearchResultPlace>
            <S.MapSearchResultSpotDivider />
        </>
    );
};

export default MapSearchResultSpot;
