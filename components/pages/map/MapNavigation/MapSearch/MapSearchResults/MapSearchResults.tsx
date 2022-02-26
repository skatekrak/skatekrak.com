import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { FlyToInterpolator, ViewportProps } from 'react-map-gl';

import Scrollbar from 'components/Ui/Scrollbar';
import type { SpotHit } from 'lib/algolia';

import MapSearchResultLoading from './MapSearchResultLoading';
import MapSearchResultNoContent from './MapSearchResultNoContent';
import MapSearchResultSpot from './MapSearchResultSpot';
import MapSearchResultPlace from './MapSearchResultPlace';
import * as S from './MapSearchResults.styled';

import { Place } from 'lib/placeApi';
import { selectSpot, setViewport } from 'store/map/actions';

type MapSearchResultsProps = {
    loading: boolean;
    places: Place[];
    spots: SpotHit[];
    onClick: () => void;
};

const MapSearchResults: React.FC<MapSearchResultsProps> = ({ spots, loading, places, onClick }) => {
    const dispatch = useDispatch();

    const onSpotClick = useCallback(
        (spot: SpotHit) => {
            const newViewport: Partial<ViewportProps> = {
                latitude: spot._geoloc.lat,
                longitude: spot._geoloc.lng,
                transitionDuration: 1000,
                transitionInterpolator: new FlyToInterpolator(),
            };
            dispatch(setViewport(newViewport));
            dispatch(selectSpot(spot.objectID));
            onClick();
        },
        [dispatch, onClick],
    );

    const onPlaceClick = useCallback(
        (place: Place) => {
            dispatch(
                setViewport({
                    latitude: place.geometry.location.lat,
                    longitude: place.geometry.location.lng,
                    transitionDuration: 1000,
                    transitionInterpolator: new FlyToInterpolator(),
                }),
            );
            onClick();
        },
        [dispatch, onClick],
    );

    return (
        <S.MapSearchResultsContainer>
            <Scrollbar maxHeight="22.25rem">
                {loading ? (
                    <MapSearchResultLoading />
                ) : (
                    <>
                        {spots.length === 0 && places.length === 0 ? (
                            <MapSearchResultNoContent />
                        ) : (
                            <>
                                {places.map((place) => (
                                    <MapSearchResultPlace key={place.id} place={place} onPlaceClick={onPlaceClick} />
                                ))}
                                {spots.map((spot) => (
                                    <MapSearchResultSpot key={spot.objectID} spot={spot} onSpotClick={onSpotClick} />
                                ))}
                            </>
                        )}
                    </>
                )}
            </Scrollbar>
        </S.MapSearchResultsContainer>
    );
};

export default MapSearchResults;
