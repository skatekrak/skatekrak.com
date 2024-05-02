import React, { useState, useEffect, useRef, useCallback, useMemo, ElementRef } from 'react';
import { MapRef } from 'react-map-gl';
import dynamic from 'next/dynamic';

import { Spot } from '@krak/carrelage-client';

import { getSpotOverview } from '@krak/carrelage-client';
import { setSpotOverview, toggleCreateSpot, updateUrlParams } from '@/store/map/slice';
import { RootState } from '@/store';

import MapQuickAccessDesktop from './mapQuickAccess/MapQuickAccessDesktop';
import MapCustomNavigation from './MapCustom/MapCustomNavigation';
import MapNavigation from './MapNavigation';
import MapBottomNav from './MapBottomNav';
import MapGradients from './MapGradients';
import MapZoomAlert from './MapZoomAlert';
import * as S from './Map.styled';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { findSpotsBoundsCoordinate, spotToGeoJSON } from '@/lib/map/helpers';
import { ZOOM_DISPLAY_WARNING } from './Map.constant';
import MapCreateSpot from './MapCreateSpot';
import useSession from '@/lib/hook/carrelage/use-session';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { useSpotsGeoJSON } from '@/shared/feudartifice/hooks/spot';
import { isEmpty, intersects } from 'radash';
import { trpc } from '@/server/trpc/utils';

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
    const customMapId = useAppSelector((state: RootState) => state.map.customMapId);
    const modalVisible = useAppSelector((state: RootState) => state.map.modalVisible);

    const [, setFirstLoad] = useState(() => (spotId ? true : false));
    const [mapLoaded, setMapLoaded] = useState(false);

    const { data: customMapInfo } = trpc.maps.fetch.useQuery({ id: id ?? '' }, { enabled: !!id });

    // Full spot
    const fullSpotContainerRef = useRef<ElementRef<'div'> | null>(null);

    const mapRef = useRef<MapRef | null>(null);

    const centerToSpot = useCallback((spot: Spot) => {
        console.log('center to spot', spot, mapRef.current);

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

    const { data: overview } = useQuery({
        queryKey: ['load-overview', spotId],
        queryFn: async () => {
            if (spotId == null) return undefined;
            const overview = await getSpotOverview(spotId);
            return overview;
        },
        enabled: spotId != null,
        retry: false,
    });

    useEffect(() => {
        if (overview != null && mapLoaded) {
            dispatch(setSpotOverview(overview));
            setFirstLoad((value) => {
                if (value) {
                    centerToSpot(overview.spot);
                    return !value;
                }
                return value;
            });
        }
    }, [overview, dispatch, centerToSpot, mapLoaded]);

    const enableSpotQuery = useMemo(() => {
        if (mapRef.current == null) {
            return false;
        }

        if (!isEmpty(id)) {
            return false;
        }

        if (viewport.zoom <= ZOOM_DISPLAY_WARNING) {
            return false;
        }

        return true;
    }, [id, viewport.zoom, mapRef]);

    const { data: spots, refetch } = useSpotsGeoJSON(mapRef?.current ?? undefined, enableSpotQuery);
    const shouldFetchWithMedia = useMemo(() => {
        if (isEmpty(customMapInfo)) return undefined;
        if (isEmpty(customMapInfo?.categories)) return true;

        return !intersects(['maps', 'skatepark', 'shop'], customMapInfo!.categories);
    }, [customMapInfo]);

    // const { data: spotsByTags } = useSpotsByTags(isEmpty(id) ? undefined : [id!], shouldFetchWithMedia);
    const { data: spotsByTags } = trpc.spots.listByTags.useQuery(
        {
            tags: isEmpty(id) ? [] : [id!],
            tagsFromMedia: shouldFetchWithMedia,
        },
        { enabled: !isEmpty(id) },
    );

    const onFullSpotClose = () => {
        dispatch(updateUrlParams({ spotId, customMapId, modal: false, mediaId: null }));
    };

    useEffect(() => {
        if (mapRef.current != null && id != null && spotsByTags != null && !isEmpty(spotsByTags)) {
            const bounds = findSpotsBoundsCoordinate(spotsByTags);
            console.log('bounds', bounds);
            mapRef.current?.fitBounds(bounds, {
                padding: isMobile ? { bottom: 100, left: 20, right: 20, top: 200 } : 254,
                duration: 1500,
            });
        }
    }, [spotsByTags, viewport.width, id, isMobile]);

    const displayedSpots = useMemo(() => {
        // It's a custom map, we can return the spots if not loading
        if (id != null) {
            if (customMapInfo) {
                return (spotsByTags ?? []).map((spot) => spotToGeoJSON(spot));
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
            <DynamicMapComponent
                mapRef={mapRef}
                spots={displayedSpots}
                onLoad={() => {
                    setMapLoaded(true);
                    refetch();
                }}
            >
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
                        <MapBottomNav isMobile={isMobile ?? false} />
                        <MapFullSpot
                            open={modalVisible}
                            onClose={onFullSpotClose}
                            container={!isMobile ? fullSpotContainerRef.current : null}
                        />
                    </>
                )}
            </DynamicMapComponent>
            <MapGradients />
        </S.MapContainer>
    );
};

export default MapContainer;
