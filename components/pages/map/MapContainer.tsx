import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { MapRef } from 'react-map-gl';
import { useSelector } from 'react-redux';
import dynamic from 'next/dynamic';

import { Spot } from 'lib/carrelageClient';

import { boxSpotsSearch, getSpotOverview } from 'lib/carrelageClient';
import {
    getSelectedFilterState,
    mapRefreshEnd,
    setSpotOverview,
    toggleCreateSpot,
    updateUrlParams,
} from 'store/map/slice';
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
import { ZOOM_DISPLAY_DOTS, ZOOM_DISPLAY_WARNING } from './Map.constant';
import MapCreateSpot from './MapCreateSpot';
import useSession from 'lib/hook/carrelage/use-session';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import useDebounce from 'lib/hook/useDebounce';

const DynamicMapComponent = dynamic(() => import('./MapComponent'), { ssr: false });
const MapFullSpot = dynamic(() => import('./MapFullSpot'), { ssr: false });

const MapContainer = () => {
    const isMobile = useSelector((state: RootState) => state.settings.isMobile);
    const status = useSelector((state: RootState) => state.map.status);
    const types = useSelector((state: RootState) => state.map.types);
    const viewport = useSelector((state: RootState) => state.map.viewport);
    const isCreateSpotOpen = useSelector((state: RootState) => state.map.isCreateSpotOpen);
    const dispatch = useAppDispatch();
    const session = useSession();
    const router = useRouter();

    /** Spot ID in the query */
    const id = useSelector((state: RootState) => state.map.customMapId);
    const spotId = useSelector((state: RootState) => state.map.selectSpot);
    const modalVisible = useSelector((state: RootState) => state.map.modalVisible);

    const [, setFirstLoad] = useState(() => (spotId ? true : false));

    const { data: customMapInfo, isLoading: customMapLoading } = useCustomMap(id);

    // Full spot
    const fullSpotContainerRef = useRef<HTMLDivElement>();

    const mapRef = useRef<MapRef>();

    const centerToSpot = useCallback((spot: Spot) => {
        mapRef.current?.flyTo({
            center: { lat: spot.location.latitude, lon: spot.location.longitude },
            zoom: 14,
            duration: 1500,
        });
    }, []);

    const onToggleSpotCreation = () => {
        if (session.data == null) {
            router.push('/auth/login');
        } else {
            dispatch(
                updateUrlParams({
                    spotId: null,
                    modal: null,
                    mediaId: null,
                }),
            );
            dispatch(toggleCreateSpot());
        }
    };

    useQuery(
        ['load-overview', spotId],
        async () => {
            const overview = await getSpotOverview(spotId);
            return overview;
        },
        {
            enabled: spotId != null,
            retry: false,
            onSuccess(data) {
                dispatch(setSpotOverview(data));

                setFirstLoad((value) => {
                    if (value) {
                        centerToSpot(data.spot);
                        return !value;
                    }
                    return value;
                });
            },
        },
    );

    const debounceViewport = useDebounce(viewport, 200);
    const { data: spots = [], refetch } = useQuery(
        ['fetch-spots-on-map', debounceViewport, status, types, customMapInfo],
        async () => {
            if (customMapInfo && customMapInfo.spots) {
                return customMapInfo.spots as Spot[];
            }

            const map = mapRef.current.getMap();
            const bounds = map.getBounds();
            const northEast = bounds.getNorthEast();
            const southWest = bounds.getSouthWest();
            const zoom = map.getZoom();

            // Only search if spots are displayed
            if (zoom > ZOOM_DISPLAY_WARNING) {
                const spots = await boxSpotsSearch({
                    northEastLatitude: northEast.lat,
                    northEastLongitude: northEast.lng,
                    southWestLatitude: southWest.lat,
                    southWestLongitude: southWest.lng,
                    filters: {
                        status: getSelectedFilterState(status),
                        type: getSelectedFilterState(types),
                    },
                    limit: 150,
                });

                return spots;
            }
            return [];
        },
        {
            enabled: mapRef.current != null,
            onSettled: () => {
                dispatch(mapRefreshEnd());
            },
            refetchOnWindowFocus: false,
            refetchOnMount: false,
        },
    );

    const onFullSpotClose = () => {
        dispatch(updateUrlParams({ modal: false, mediaId: null }));
    };

    useEffect(() => {
        if (mapRef.current != null && id != null && customMapInfo != null) {
            const bounds = findBoundsCoordinate(
                customMapInfo.spots.map((spot) => [spot.location.longitude, spot.location.latitude]),
            );
            mapRef.current?.fitBounds(bounds, { padding: 128, duration: 1500 });
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

        if (viewport.zoom <= ZOOM_DISPLAY_WARNING) {
            return [];
        }

        return spots;
    }, [spots, id, customMapLoading, viewport.zoom]);

    return (
        <S.MapContainer ref={fullSpotContainerRef}>
            <DynamicMapComponent mapRef={mapRef} spots={displayedSpots} onLoad={refetch}>
                {isCreateSpotOpen ? (
                    <MapCreateSpot />
                ) : (
                    <>
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
                            <MapNavigation handleCreateSpotClick={onToggleSpotCreation} />
                        )}
                        {!isMobile && <MapQuickAccessDesktop />}
                        {viewport.zoom <= ZOOM_DISPLAY_WARNING && id == null && <MapZoomAlert />}
                        <MapBottomNav isMobile={isMobile} />
                        <MapFullSpot
                            open={modalVisible}
                            onClose={onFullSpotClose}
                            container={!isMobile && fullSpotContainerRef.current}
                        />
                    </>
                )}
            </DynamicMapComponent>
            <MapGradients />
        </S.MapContainer>
    );
};

export default MapContainer;
