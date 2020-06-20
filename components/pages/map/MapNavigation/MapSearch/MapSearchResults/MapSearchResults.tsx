import React from 'react';

import Scrollbar from 'components/Ui/Scrollbar';

import MapSearchResultLoading from './MapSearchResultLoading';
import MapSearchResultNoContent from './MapSearchResultNoContent';
import MapSearchResultSpot from './MapSearchResultSpot';
import MapSearchResultPlace from './MapSearchResultPlace';

import { Spot } from 'lib/carrelageClient';

const fakeSpot = {
    id: 'dazdazd',
    name: 'Triple set Santa Monica - Los Angeles',
    type: 'street',
    // status: 'wip',
    tags: ['famous', 'history', 'minute', 'famous', 'minute', 'famous', 'minute'],
    location: {
        streetNumber: '154',
        streetName: 'Maison fond gare du Nord, rue de la nation skateboard',
        city: 'New york city',
        country: 'USA',
    },
};

const index = () => {
    const loading = false;
    const results = [fakeSpot, fakeSpot, fakeSpot];
    const places = [{ name: 'New York City' }];

    const onSpotClick = (spot: Spot) => {
        return;
    };

    const onPlaceClick = (place) => {
        return;
    };

    return (
        <div id="map-navigation-search-results">
            <Scrollbar maxHeight="22.25rem">
                {loading && <MapSearchResultLoading />}
                {results.length === 0 ? (
                    <MapSearchResultNoContent />
                ) : (
                    <>
                        {results.map((spot) => (
                            <MapSearchResultSpot spot={fakeSpot} onSpotClick={onSpotClick} />
                        ))}
                        {places.map((place) => (
                            <MapSearchResultPlace place={place} onPlaceClick={onPlaceClick} />
                        ))}
                    </>
                )}
            </Scrollbar>
        </div>
    );
};

export default index;
