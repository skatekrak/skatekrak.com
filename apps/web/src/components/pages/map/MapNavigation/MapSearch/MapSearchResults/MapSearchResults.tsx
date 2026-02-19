import React from 'react';
import { useMap } from 'react-map-gl';

import Scrollbar from '@/components/Ui/Scrollbar';
import type { SpotHit } from '@/lib/meilisearch';

import MapSearchResultLoading from './MapSearchResultLoading';
import MapSearchResultNoContent from './MapSearchResultNoContent';
import MapSearchResultSpot from './MapSearchResultSpot';
import MapSearchResultPlace from './MapSearchResultPlace';

import { Place } from '@/lib/placeApi';
import { useSpotID } from '@/lib/hook/queryState';

type MapSearchResultsProps = {
    loading: boolean;
    places: Place[];
    spots: SpotHit[];
    onClick: () => void;
};

const MapSearchResults: React.FC<MapSearchResultsProps> = ({ spots, loading, places, onClick }) => {
    const { current: map } = useMap();
    const [, selectSpot] = useSpotID();

    const onSpotClick = (spot: SpotHit) => {
        map?.flyTo({
            center: {
                lat: spot._geo.lat,
                lon: spot._geo.lng,
            },
            duration: 1000,
        });
        selectSpot(spot.objectID);
        onClick();
    };

    const onPlaceClick = (place: Place) => {
        map?.flyTo({
            center: {
                lat: place.geometry.location.lat,
                lon: place.geometry.location.lng,
            },
            duration: 1000,
        });
        onClick();
    };

    return (
        <div className="absolute top-[3.75rem] left-0 right-0 text-onDark-highEmphasis bg-tertiary-dark border border-tertiary-medium rounded shadow-onDarkHighSharp">
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
        </div>
    );
};

export default MapSearchResults;
