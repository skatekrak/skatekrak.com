import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { MapRef } from 'react-map-gl';
import { useSelector } from 'react-redux';
import dynamic from 'next/dynamic';

import { Spot } from 'lib/carrelageClient';

import { boxSpotsSearch, getSpotOverview } from 'lib/carrelageClient';
import { getSelectedFilterState, mapRefreshEnd, setSpotOverview, updateUrlParams } from 'store/map/slice';
import { RootState } from 'store';
import useCustomMap from 'lib/hook/use-custom-map';

import MapQuickAccessDesktop from './mapQuickAccess/MapQuickAccessDesktop';
import MapCustomNavigation from './MapCustom/MapCustomNavigation';
import MapNavigation from './MapNavigation';
import MapBottomNav from './MapBottomNav';
import MapGradients from './MapGradients';
import MapZoomAlert from './MapZoomAlert';
import * as S from './Map.styled';
import { useAppDispatch } from 'store/hook';
import { findBoundsCoordinate } from 'lib/map/helpers';

const DynamicMapComponent = dynamic(() => import('./MapComponent'), { ssr: false });
const MapFullSpot = dynamic(() => import('./MapFullSpot'), { ssr: false });

const MAX_ZOOM_DISPLAY_SPOT = 11.6;

const MapContainer = () => {
    const isMobile = useSelector((state: RootState) => state.settings.isMobile);
    const status = useSelector((state: RootState) => state.map.status);
    const types = useSelector((state: RootState) => state.map.types);
    const viewport = useSelector((state: RootState) => state.map.viewport);
    const dispatch = useAppDispatch();

    /** Spot ID in the query */
    const id = useSelector((state: RootState) => state.map.customMapId);
    const spotId = useSelector((state: RootState) => state.map.selectSpot);
    const modalVisible = useSelector((state: RootState) => state.map.modalVisible);

    const [spots, setSpots] = useState<Spot[]>([]);
    const [, setFirstLoad] = useState(() => (spotId ? true : false));

    const { data: customMapInfo, isLoading: customMapLoading } = useCustomMap(id);

    // Full spot
    const fullSpotContainerRef = useRef<HTMLDivElement>();

    const mapRef = useRef<MapRef>();
    const loadTimeout = useRef<NodeJS.Timeout>();

    const centerToSpot = useCallback((spot: Spot) => {
        mapRef.current?.flyTo({
            center: { lat: spot.location.latitude, lon: spot.location.longitude },
            zoom: 14,
            duration: 1500,
        });
    }, []);

    const refreshMap = useCallback(
        (_spots: Spot[] | undefined = undefined) => {
            setSpots(() => {
                dispatch(mapRefreshEnd());

                return _spots;
            });
        },
        [dispatch, types, status],
    );

    useEffect(() => {
        if (customMapInfo && customMapInfo.spots) {
            refreshMap(customMapInfo.spots);
        }
    }, [customMapInfo, refreshMap]);

    useEffect(() => {
        const loadOverview = async () => {
            if (spotId != null) {
                try {
                    const overview = await getSpotOverview(spotId);
                    dispatch(setSpotOverview(overview));

                    setFirstLoad((value) => {
                        if (value) {
                            centerToSpot(overview.spot);
                            return !value;
                        }
                        return value;
                    });
                } catch (err) {
                    console.error(err);
                }
            }
        };

        loadOverview();
    }, [spotId, dispatch, centerToSpot]);

    const load = useCallback(() => {
        clearTimeout(loadTimeout.current);

        // We are in path `/`
        if (id === undefined) {
            loadTimeout.current = setTimeout(async () => {
                if (mapRef.current) {
                    const map = mapRef.current.getMap();
                    const bounds = map.getBounds();
                    const northEast = bounds.getNorthEast();
                    const southWest = bounds.getSouthWest();
                    const zoom = map.getZoom();

                    if (zoom > MAX_ZOOM_DISPLAY_SPOT) {
                        const newClusters = await boxSpotsSearch({
                            northEastLatitude: northEast.lat,
                            northEastLongitude: northEast.lng,
                            southWestLatitude: southWest.lat,
                            southWestLongitude: southWest.lng,
                            filters: {
                                status: getSelectedFilterState(status),
                                type: getSelectedFilterState(types),
                            },
                        });

                        refreshMap(newClusters);
                    } else {
                        refreshMap([]);
                    }
                }
            }, 200);
        }
    }, [id, refreshMap]);

    const onFullSpotClose = () => {
        dispatch(updateUrlParams({ modal: false }));
    };

    useEffect(() => {
        if (id === undefined) {
            load();
        }
    }, [status, types, id, viewport, load]);

    useEffect(() => {
        if (mapRef.current != null && id != null && customMapInfo != null) {
            const bounds = findBoundsCoordinate(
                customMapInfo.spots.map((spot) => [spot.location.longitude, spot.location.latitude]),
            );
            mapRef.current?.fitBounds(bounds, { padding: 0.15, duration: 1500 });
        }
    }, [customMapInfo, viewport.width, id, dispatch]);

    const displayedSpots = useMemo(() => {
        // It's a custom map, we can return the spots if not loading
        if (id != null) {
            if (customMapLoading) {
                return [];
            }
            return spots;
        }

        if (viewport.zoom <= MAX_ZOOM_DISPLAY_SPOT) {
            return [];
        }

        return spots;
    }, [spots, id, customMapLoading, viewport.zoom]);

    return (
        <S.MapContainer ref={fullSpotContainerRef}>
            <>
                <MapFullSpot
                    open={modalVisible}
                    onClose={onFullSpotClose}
                    container={!isMobile && fullSpotContainerRef.current}
                />
                <DynamicMapComponent mapRef={mapRef} spots={displayedSpots}>
                    <MapBottomNav isMobile={isMobile} />
                    {id !== undefined && customMapInfo !== undefined ? (
                        <MapCustomNavigation
                            id={customMapInfo.id}
                            title={customMapInfo.name}
                            about={customMapInfo.about}
                            subtitle={customMapInfo.subtitle}
                            spots={customMapInfo.spots}
                            videos={customMapInfo.videos}
                        />
                    ) : (
                        <MapNavigation />
                    )}
                    {!isMobile && <MapQuickAccessDesktop />}
                    {viewport.zoom <= MAX_ZOOM_DISPLAY_SPOT && id == null && <MapZoomAlert />}
                </DynamicMapComponent>
                <MapGradients />
            </>
        </S.MapContainer>
    );
};

export default MapContainer;
