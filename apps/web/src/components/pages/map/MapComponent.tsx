import 'maplibre-gl/dist/maplibre-gl.css';
import { layers, namedFlavor } from '@protomaps/basemaps';
import maplibregl, { type StyleSpecification } from 'maplibre-gl';
import { Protocol } from 'pmtiles';
import { intersects } from 'radash';
import React, { useCallback, useEffect, useMemo, useState, memo } from 'react';
import ReactMapGL, {
    AttributionControl,
    GeolocateControl,
    MapLayerMouseEvent,
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
import { trackEvent } from '@/lib/analytics';
import { useSpotID, useSpotModal, useViewport } from '@/lib/hook/queryState';
import { mapStyles, useMapStore } from '@/store/map';
import { useSettingsStore } from '@/store/settings';

import SmallLayer from './layers/SmallLayer';
import SpotPinLayer from './layers/SpotPinLayer';
import { MAX_ZOOM_LEVEL, ZOOM_DISPLAY_DOTS, MIN_ZOOM_LEVEL } from './Map.constant';
import MapSpotOverview from './MapSpotOverview';

import type { FeatureCollection, Geometry } from 'geojson';

const pmtilesUrl = 'https://krakmaps.ams3.cdn.digitaloceanspaces.com/20260822.pmtiles';
const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

maplibregl.addProtocol('pmtiles', new Protocol().tile);

type MapComponentProps = {
    mapRef: React.RefObject<MapRef | null>;
    onLoad?: () => void;
    spots: SpotGeoJSON[];
    children?: React.ReactNode;
};

const MapComponent = ({ mapRef, spots, children, onLoad }: MapComponentProps) => {
    const [selectedSpotOverview, setSpotOverview, toggleLegend, toggleSearchResult, mapStyle, setMapStyle] =
        useMapStore(
            useShallow((state) => [
                state.spotOverview,
                state.setSpotOverview,
                state.toggleLegend,
                state.toggleSearchResult,
                state.mapStyle,
                state.setMapStyle,
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
        trackEvent('spot', 'open_modal');
    };

    const onPopupClose = useCallback(() => {
        if (spotId != null) {
            setSpotId(null);
        }

        if (selectedSpotOverview != null) {
            setSpotOverview(null);
        }
    }, [setSpotOverview, spotId, selectedSpotOverview, setSpotId]);

    const spotLayerIds = useMemo(
        () => ['spot-small-point', ...Object.values(Types).map((type) => `spot-layer-${type}`)],
        [],
    );

    const onMapClick = useCallback(
        (event: MapLayerMouseEvent) => {
            const map = mapRef.current?.getMap();
            if (!map || spotId == null) return;

            const features = map.queryRenderedFeatures(event.point, { layers: spotLayerIds });
            if (features.length === 0) {
                onPopupClose();
            }
        },
        [mapRef, spotId, spotLayerIds, onPopupClose],
    );

    const onViewportChange = async (viewState: ViewStateChangeEvent) => {
        await setViewport(viewState.viewState);
    };

    const isMobile = useSettingsStore((state) => state.isMobile);
    const [mapStyleReady, setMapStyleReady] = useState(false);

    const basemapStyle = useMemo<string | StyleSpecification>(() => {
        if (mapStyle === 'satellite-streets-v12') {
            return 'https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12';
        }

        return {
            version: 8,
            glyphs: 'https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf',
            sprite: `https://protomaps.github.io/basemaps-assets/sprites/v4/${mapStyle}`,
            sources: {
                protomaps: {
                    type: 'vector',
                    url: `pmtiles://${pmtilesUrl}`,
                },
            },
            layers: layers('protomaps', namedFlavor(mapStyle), { lang: 'en' }),
        };
    }, [mapStyle]);

    useEffect(() => {
        if (window.innerWidth < 1024) {
            setMapStyle('light');
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setMapStyle(prefersDark ? 'dark' : 'light');
        }
        setMapStyleReady(true);
    }, [setMapStyle, isMobile]);

    const onSwitchMapStyle = () => {
        const currentIndex = mapStyles.indexOf(mapStyle);
        const nextIndex = (currentIndex + 1) % mapStyles.length;
        setMapStyle(mapStyles[nextIndex]);
    };

    if (!mapStyleReady) return null;

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
                validateStyle={false}
                mapStyle={basemapStyle}
                transformRequest={(url: string) => {
                    if (url.startsWith('mapbox://fonts/')) {
                        const path = url.replace('mapbox://fonts/', '');
                        return { url: `https://api.mapbox.com/fonts/v1/${path}?access_token=${mapboxToken}` };
                    }
                    if (url.startsWith('mapbox://sprites/')) {
                        const path = url.replace('mapbox://sprites/', '');
                        return { url: `https://api.mapbox.com/styles/v1/${path}/sprite?access_token=${mapboxToken}` };
                    }
                    if (url.startsWith('mapbox://')) {
                        const path = url.replace('mapbox://', '');
                        return { url: `https://api.mapbox.com/v4/${path}.json?secure&access_token=${mapboxToken}` };
                    }
                    if (
                        (url.includes('api.mapbox.com') || url.includes('tiles.mapbox.com')) &&
                        !url.includes('access_token=')
                    ) {
                        return { url: `${url}${url.includes('?') ? '&' : '?'}access_token=${mapboxToken}` };
                    }
                    return { url };
                }}
                projection={{ type: 'mercator' }}
                onMove={onViewportChange}
                onLoad={onLoad}
                onClick={onMapClick}
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
                <AttributionControl compact position="bottom-left" />
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
