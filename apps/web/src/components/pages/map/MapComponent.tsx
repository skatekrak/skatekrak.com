import { intersects } from 'radash';
import React, { useCallback, useMemo, memo } from 'react';
import ReactMapGL, {
    GeolocateControl,
    MapRef,
    NavigationControl,
    Source,
    ViewStateChangeEvent,
} from 'react-map-gl/maplibre';
import { useShallow } from 'zustand/react/shallow';

import { SpotGeoJSON } from '@krak/types';
import { Status, Types } from '@krak/types';

import SpotMarker from '@/components/pages/map/marker/SpotMarker';
import IconLayer from '@/components/Ui/Icons/IconLayer';
import { useMapStyle, useSpotID, useSpotModal, useViewport } from '@/lib/hook/queryState';
import { useMapStore } from '@/store/map';

import SmallLayer from './layers/SmallLayer';
import SpotPinLayer from './layers/SpotPinLayer';
import { MAX_ZOOM_LEVEL, ZOOM_DISPLAY_DOTS, MIN_ZOOM_LEVEL } from './Map.constant';
import MapSpotOverview from './MapSpotOverview';

import type { FeatureCollection, Geometry } from 'geojson';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

type MapComponentProps = {
    mapRef: React.RefObject<MapRef | null>;
    onLoad?: () => void;
    spots: SpotGeoJSON[];
    children?: React.ReactNode;
};

const MapComponent = ({ mapRef, spots, children, onLoad }: MapComponentProps) => {
    const [selectedSpotOverview, setSpotOverview, toggleLegend, toggleSearchResult] = useMapStore(
        useShallow((state) => [
            state.spotOverview,
            state.setSpotOverview,
            state.toggleLegend,
            state.toggleSearchResult,
        ]),
    );
    const [viewport, setViewport] = useViewport();
    const [spotId, setSpotId] = useSpotID();
    const [, setModalVisible] = useSpotModal();

    const [markers, spotSourceData]: [React.ReactElement[], FeatureCollection<Geometry>] = useMemo(() => {
        const mrks: React.ReactElement[] = [];
        const spotData: FeatureCollection<Geometry> = {
            type: 'FeatureCollection',
            features: [],
        };

        for (const spot of spots) {
            if (isSpotMarker(spot) && viewport.zoom > ZOOM_DISPLAY_DOTS) {
                mrks.push(
                    <SpotMarker
                        key={spot.id}
                        spot={spot}
                        isSelected={selectedSpotOverview ? selectedSpotOverview.spot.id === spot.id : false}
                    />,
                );
            } else {
                spotData.features.push(spot);
            }
        }

        return [mrks, spotData];
    }, [spots, selectedSpotOverview, viewport.zoom]);

    const onPopupClick = () => {
        setModalVisible(true);
        toggleLegend(false);
        toggleSearchResult(false);
    };

    const onPopupClose = useCallback(() => {
        if (spotId != null) {
            setSpotId(null);
        }

        if (selectedSpotOverview != null) {
            setSpotOverview(null);
        }
    }, [setSpotOverview, spotId, selectedSpotOverview, setSpotId]);

    const onViewportChange = async (viewState: ViewStateChangeEvent) => {
        await setViewport(viewState.viewState);
    };

    const [mapStyle, setMapStyle] = useMapStyle();

    const onSwitchMapStyle = () => {
        setMapStyle(mapStyle === 'dark-v11' ? 'satellite-streets-v12' : 'dark-v11');
    };

    return (
        <div className="absolute top-0 right-0 bottom-0 left-0">
            <ReactMapGL
                ref={mapRef}
                {...viewport}
                style={{ width: '100%', height: '100%' }}
                minZoom={MIN_ZOOM_LEVEL}
                maxZoom={MAX_ZOOM_LEVEL}
                attributionControl={false}
                maplibreLogo={false}
                // Mapbox style JSON contains proprietary properties (name, owner, etc.)
                // that MapLibre's strict validator flags as unknown — disable validation
                validateStyle={false}
                mapStyle={`https://api.mapbox.com/styles/v1/mapbox/${mapStyle}`}
                transformRequest={(url: string) => {
                    // Resolve mapbox:// protocol URIs that MapLibre doesn't understand
                    if (url.startsWith('mapbox://fonts/')) {
                        const path = url.replace('mapbox://fonts/', '');
                        return { url: `https://api.mapbox.com/fonts/v1/${path}?access_token=${MAPBOX_TOKEN}` };
                    }
                    if (url.startsWith('mapbox://sprites/')) {
                        const path = url.replace('mapbox://sprites/', '');
                        return { url: `https://api.mapbox.com/styles/v1/${path}/sprite?access_token=${MAPBOX_TOKEN}` };
                    }
                    if (url.startsWith('mapbox://')) {
                        const path = url.replace('mapbox://', '');
                        return { url: `https://api.mapbox.com/v4/${path}.json?secure&access_token=${MAPBOX_TOKEN}` };
                    }
                    // Append token to any other Mapbox API requests
                    if (url.includes('api.mapbox.com') || url.includes('tiles.mapbox.com')) {
                        if (!url.includes('access_token=')) {
                            return {
                                url: url.includes('?')
                                    ? `${url}&access_token=${MAPBOX_TOKEN}`
                                    : `${url}?access_token=${MAPBOX_TOKEN}`,
                            };
                        }
                    }
                    return { url };
                }}
                projection={{ type: 'mercator' }}
                onMove={onViewportChange}
                onLoad={onLoad}
            >
                <Source id="spots" type="geojson" data={spotSourceData}>
                    <SmallLayer />
                    <SpotPinLayer type={Types.Street} />
                    <SpotPinLayer type={Types.Shop} />
                    <SpotPinLayer type={Types.Park} />
                    <SpotPinLayer type={Types.Diy} />
                    <SpotPinLayer type={Types.Private} />
                    <SpotPinLayer type={Status.Rip} />
                    <SpotPinLayer type={Status.Wip} />
                </Source>
                {/* Popup */}
                {spotId != null && selectedSpotOverview != null && (
                    <MapSpotOverview
                        spotOverview={selectedSpotOverview}
                        onPopupClick={onPopupClick}
                        onPopupClose={onPopupClose}
                    />
                )}
                {children}

                {/* Marker */}
                {markers}

                {/* Controls */}
                <button
                    className="absolute bottom-4 tablet:bottom-6 right-14 tablet:right-16 text-sm bg-white hover:bg-gray-100 text-white p-2 rounded-md"
                    onClick={onSwitchMapStyle}
                >
                    <IconLayer className="w-5 h-5" />
                </button>
                <NavigationControl position="bottom-right" />
                <GeolocateControl position="bottom-right" showAccuracyCircle={false} />
            </ReactMapGL>
        </div>
    );
};

const isSpotMarker = (spot: SpotGeoJSON): boolean => {
    return spot.properties.mediasStat.all >= 10 || intersects(spot.properties.tags, ['history', 'famous', 'minute']);
};

export default memo(MapComponent);
