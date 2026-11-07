import React from 'react';
import { useMap } from 'react-map-gl/maplibre';

import type { Country } from '@krak/contracts';

import CountryImage from '@/components/pages/map/countries/CountryImage';
import Scrollbar from '@/components/Ui/Scrollbar';
import { useCityID, useCountryID, useCustomMapID, useMediaID, useSpotID, useSpotModal } from '@/lib/hook/queryState';

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
    floatingRef: (node: HTMLElement | null) => void;
    floatingStyles: React.CSSProperties;
    floatingProps: Record<string, unknown>;
    maxHeight: string;
};

const MapSearchResults: React.FC<MapSearchResultsProps> = ({
    results,
    loading,
    onClick,
    floatingRef,
    floatingStyles,
    floatingProps,
    maxHeight,
}) => {
    const { current: map } = useMap();
    const [, selectSpot] = useSpotID();
    const [, setCustomMapID] = useCustomMapID();
    const [, setCountryID] = useCountryID();
    const [, setCityID] = useCityID();
    const [, setMediaID] = useMediaID();
    const [, setSpotModal] = useSpotModal();

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
        setCountryID(null);
        setCityID(null);
        setCustomMapID(customMap.id);
    };

    const onCountryClick = (country: Country) => {
        setCountryID(country.id);
        setCustomMapID(null);
        setCityID(null);
        selectSpot(null);
        setMediaID(null);
        setSpotModal(null);
        onClick();
    };

    return (
        <div
            ref={floatingRef}
            style={floatingStyles}
            {...floatingProps}
            className="w-full text-onDark-highEmphasis bg-tertiary-dark border border-tertiary-medium rounded shadow-onDarkHighSharp"
        >
            <Scrollbar maxHeight={maxHeight}>
                {loading ? (
                    <MapSearchResultLoading />
                ) : (
                    <>
                        {results.length === 0 ? (
                            <MapSearchResultNoContent />
                        ) : (
                            <>
                                {results.map((item) =>
                                    item.kind === 'country' ? (
                                        <button
                                            key={`country-${item.data.id}`}
                                            type="button"
                                            className="flex w-full items-center gap-3 p-3 text-left hover:bg-tertiary-medium"
                                            onClick={() => onCountryClick(item.data)}
                                        >
                                            <CountryImage country={item.data} />
                                            <span className="min-w-0 flex-1 break-words">{item.data.name}</span>
                                            <span className="text-sm text-onDark-mediumEmphasis">Country</span>
                                        </button>
                                    ) : item.kind === 'spot' ? (
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
