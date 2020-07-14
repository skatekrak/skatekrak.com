import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import Scrollbar from 'components/Ui/Scrollbar';

import MapSearchResultLoading from './MapSearchResultLoading';
import MapSearchResultNoContent from './MapSearchResultNoContent';
import MapSearchResultSpot from './MapSearchResultSpot';
import MapSearchResultPlace from './MapSearchResultPlace';

import { Spot } from 'lib/carrelageClient';
import { selectSpot } from 'store/map/actions';

type MapSearchResultsProps = {
    loading: boolean;
    spots: Spot[];
};

const MapSearchResults: React.FC<MapSearchResultsProps> = ({ spots, loading }) => {
    const dispatch = useDispatch();
    const places = [];

    const onSpotClick = useCallback(
        (spot: Spot) => {
            dispatch(selectSpot(spot));
        },
        [dispatch],
    );

    const onPlaceClick = (place) => {
        return;
    };

    return (
        <div id="map-navigation-search-results">
            <Scrollbar maxHeight="22.25rem">
                {loading ? (
                    <MapSearchResultLoading />
                ) : (
                    <>
                        {spots.length === 0 ? (
                            <MapSearchResultNoContent />
                        ) : (
                            <>
                                {spots.map((spot) => (
                                    <MapSearchResultSpot key={spot.id} spot={spot} onSpotClick={onSpotClick} />
                                ))}
                                {places.map((place) => (
                                    <MapSearchResultPlace place={place} onPlaceClick={onPlaceClick} />
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
