import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { MapRef } from 'react-map-gl';
import dynamic from 'next/dynamic';

import { Spot } from 'lib/carrelageClient';

import { getSpotOverview } from 'lib/carrelageClient';
import { setSpotOverview, toggleCreateSpot, updateUrlParams } from 'store/map/slice';
import { RootState } from 'store';
import useCustomMap from 'lib/hook/use-custom-map';

import MapQuickAccessDesktop from './mapQuickAccess/MapQuickAccessDesktop';
import MapCustomNavigation from './MapCustom/MapCustomNavigation';
import MapNavigation from './MapNavigation';
import MapBottomNav from './MapBottomNav';
import MapGradients from './MapGradients';
import MapZoomAlert from './MapZoomAlert';
import * as S from './Map.styled';
import { useAppDispatch, useAppSelector } from 'store/hook';
import { findBoundsCoordinate } from 'lib/map/helpers';
import { ZOOM_DISPLAY_WARNING } from './Map.constant';
import MapCreateSpot from './MapCreateSpot';
import useSession from 'lib/hook/carrelage/use-session';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { useSpotsByTags, useSpotsSearch } from 'shared/feudartifice/hooks/spot';
import { isEmpty } from 'radash';

const DynamicMapComponent = dynamic(() => import('./MapComponent'), { ssr: false });
const MapFullSpot = dynamic(() => import('./MapFullSpot'), { ssr: false });

const MapContainer = () => {
    const isMobile = useAppSelector((state: RootState) => state.settings.isMobile);
    const isCreateSpotOpen = useAppSelector((state: RootState) => state.map.isCreateSpotOpen);
    const viewport = useAppSelector((state) => state.map.viewport);
    const dispatch = useAppDispatch();
    const session = useSession();
    const router = useRouter();

    /** Spot ID in the query */
    const id = useAppSelector((state: RootState) => state.map.customMapId);
    const spotId = useAppSelector((state: RootState) => state.map.selectSpot);
    const modalVisible = useAppSelector((state: RootState) => state.map.modalVisible);

    const [, setFirstLoad] = useState(() => (spotId ? true : false));

    const { data: customMapInfo } = useCustomMap(id);

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

    const enableSpotQuery = useMemo(() => {
        if (mapRef.current == null) {
            return false;
        }

        if (id != null || id === '') {
            return false;
        }

        if (viewport.zoom <= ZOOM_DISPLAY_WARNING) {
            return false;
        }

        return true;
    }, [id, viewport.zoom]);

    const { data: spots, refetch } = useSpotsSearch(mapRef, enableSpotQuery);
    const { data: spotsByTags } = useSpotsByTags(isEmpty(id) ? null : [id]);

    const onFullSpotClose = () => {
        dispatch(updateUrlParams({ modal: false, mediaId: null }));
    };

    useEffect(() => {
        if (mapRef.current != null && id != null && spotsByTags != null) {
            const bounds = findBoundsCoordinate(
                spotsByTags.map((spot) => [spot.location.longitude, spot.location.latitude]),
            );
            mapRef.current?.fitBounds(bounds, { padding: 128, duration: 1500 });
        }
    }, [spotsByTags, viewport.width, id, dispatch]);

    const displayedSpots = useMemo(() => {
        // It's a custom map, we can return the spots if not loading
        if (id != null) {
            if (customMapInfo) {
                return spotsByTags ?? [];
            }
            return [];
        }

        if (viewport.zoom <= ZOOM_DISPLAY_WARNING) {
            return [];
        }

        return spots;
    }, [spots, id, viewport.zoom, customMapInfo, spotsByTags]);

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
                                spots={spotsByTags ?? []}
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
