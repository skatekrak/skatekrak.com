import React from 'react';
import { useMap } from 'react-map-gl/maplibre';

import Scrollbar from '@/components/Ui/Scrollbar';
import { useSpotID } from '@/lib/hook/queryState';

import MapSearchResultLoading from './MapSearchResultLoading';
import MapSearchResultMap from './MapSearchResultMap';
import MapSearchResultNoContent from './MapSearchResultNoContent';
import MapSearchResultSpot from './MapSearchResultSpot';

import type { SearchResultItem } from '@/lib/hook/useMapSearch';
import type { MapHit, SpotHit } from '@/lib/meilisearch';

type MapSearchResultsProps = {
    loading: boolean;
    results: SearchResultItem[];
    onClick: () => void;
};

const MapSearchResults: React.FC<MapSearchResultsProps> = ({ results, loading, onClick }) => {
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

    const onMapClick = (customMap: MapHit) => {
        console.log('Map clicked:', customMap.id);
        onClick();
    };

    return (
        <div className="absolute top-15 left-0 right-0 text-onDark-highEmphasis bg-tertiary-dark border border-tertiary-medium rounded shadow-onDarkHighSharp">
            <Scrollbar maxHeight="22.25rem">
                {loading ? (
                    <MapSearchResultLoading />
                ) : (
                    <>
                        {results.length === 0 ? (
                            <MapSearchResultNoContent />
                        ) : (
                            <>
                                {results.map((item) =>
                                    item.kind === 'spot' ? (
                                        <MapSearchResultSpot
                                            key={item.data.objectID}
                                            spot={item.data}
                                            onSpotClick={onSpotClick}
                                        />
                                    ) : (
                                        <MapSearchResultMap
                                            key={item.data.id}
                                            map={item.data}
                                            onMapClick={onMapClick}
                                        />
                                    ),
                                )}
                            </>
                        )}
                    </>
                )}
            </Scrollbar>
        </div>
    );
};

export default MapSearchResults;
