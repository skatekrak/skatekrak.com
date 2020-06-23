import React from 'react';

import Scrollbar from 'components/Ui/Scrollbar';

import MapSearchResultLoading from './MapSearchResultLoading';
import MapSearchResultNoContent from './MapSearchResultNoContent';
import MapSearchResultSpot from './MapSearchResultSpot';
import MapSearchResultPlace from './MapSearchResultPlace';

import { Spot } from 'lib/carrelageClient';

type MapSearchResultsProps = {
    loading: boolean;
    spots: Spot[];
};

const MapSearchResults: React.FC<MapSearchResultsProps> = ({ spots, loading }) => {
    const places = [];

    const onSpotClick = (spot: Spot) => {
        return;
    };

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
