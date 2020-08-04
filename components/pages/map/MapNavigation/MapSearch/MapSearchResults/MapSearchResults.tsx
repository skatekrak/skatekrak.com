import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FlyToInterpolator } from 'react-map-gl';

import Scrollbar from 'components/Ui/Scrollbar';

import MapSearchResultLoading from './MapSearchResultLoading';
import MapSearchResultNoContent from './MapSearchResultNoContent';
import MapSearchResultSpot from './MapSearchResultSpot';
import MapSearchResultPlace from './MapSearchResultPlace';

import Types from 'Types';

import { Spot } from 'lib/carrelageClient';
import { Place } from 'lib/placeApi';
import { selectSpot, setViewport } from 'store/map/actions';

type MapSearchResultsProps = {
    loading: boolean;
    places: Place[];
    spots: Spot[];
};

const MapSearchResults: React.FC<MapSearchResultsProps> = ({ spots, loading, places }) => {
    const dispatch = useDispatch();
    const { viewport } = useSelector((state: Types.RootState) => state.map);

    const onSpotClick = useCallback(
        (spot: Spot) => {
            dispatch(selectSpot(spot));
        },
        [dispatch],
    );

    const onPlaceClick = useCallback(
        (place: Place) => {
            dispatch(
                setViewport({
                    ...viewport,
                    latitude: place.geometry.location.lat,
                    longitude: place.geometry.location.lng,
                    transitionDuration: 1000,
                    transitionInterpolator: new FlyToInterpolator(),
                }),
            );
        },
        [dispatch],
    );

    return (
        <div id="map-navigation-search-results">
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
                                    <MapSearchResultSpot key={spot.id} spot={spot} onSpotClick={onSpotClick} />
                                ))}
                            </>
                        )}
                    </>
                )}
            </Scrollbar>
        </div>
    );
};

export default MapSearchResults;
