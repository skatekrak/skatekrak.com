import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { isEmpty, intersects } from 'radash';
import React, { useState, useEffect, useRef, useCallback, useMemo, ElementRef } from 'react';
import { MapRef } from 'react-map-gl';
import { useShallow } from 'zustand/react/shallow';

import type { Spot } from '@krak/contracts';

import Analytics from '@/lib/analytics';

import CityPanel from '@/components/pages/map/cities/CityPanel';
import MapCustomPanel from '@/components/pages/map/MapCustom/panel/MapCustomPanel';
import { SpinnerCircle } from '@/components/Ui/Icons/Spinners';
import useSession from '@/lib/hook/carrelage/use-session';
import { useCityID, useCustomMapID, useMediaID, useSpotID, useSpotModal, useViewport } from '@/lib/hook/queryState';
import { useSpotsGeoJSON } from '@/lib/hook/useSpotsGeoJSON';
import { findSpotsBoundsCoordinate, spotToGeoJSON } from '@/lib/map/helpers';
import { orpc } from '@/server/orpc/client';
import { useMapStore } from '@/store/map';
import { useSettingsStore } from '@/store/settings';

import { ZOOM_DISPLAY_WARNING } from './Map.constant';
import MapBottomNav from './MapBottomNav/MapBottomNav';
import MapCreateSpot from './MapCreateSpot';
import MapGradients from './MapGradients';
import MapNavigation from './MapNavigation';
import QuickAccessDesktop from './mapQuickAccess/desktop/quick-access-desktop';
import { CustomMapCategory } from './mapQuickAccess/types';
import MapZoomAlert from './MapZoomAlert';

const DynamicMapComponent = dynamic(() => import('./MapComponent'), { ssr: false });
const MapFullSpot = dynamic(() => import('./MapFullSpot'), { ssr: false });

const MapContainer = () => {
    const isMobile = useSettingsStore((state) => state.isMobile);
    const [isCreateSpotOpen, toggleCreateSpot, setSpotOverview] = useMapStore(
        useShallow((state) => [state.isCreateSpotOpen, state.toggleCreateSpot, state.setSpotOverview]),
    );
    const [viewport] = useViewport();
    const session = useSession();
    const router = useRouter();

    /** Spot ID in the query */
    const [id] = useCustomMapID();
    const [city] = useCityID();
    const [spotId, setSpotID] = useSpotID();
    const [modalVisible, setModalVisible] = useSpotModal();
    const [, setMedia] = useMediaID();

    const [, setFirstLoad] = useState(() => (spotId ? true : false));
    const [mapLoaded, setMapLoaded] = useState(false);

    const { data: customMapInfo } = useQuery(orpc.maps.fetch.queryOptions({ input: { id: id ?? '' }, enabled: !!id }));

    // Full spot
    const fullSpotContainerRef = useRef<ElementRef<'div'> | null>(null);

    const mapRef = useRef<MapRef | null>(null);

    const centerToSpot = useCallback((spot: Pick<Spot, 'location'>) => {
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
            Analytics.trackEvent('spot_add_started');
            setSpotID(null);
            setModalVisible(null);
            setMedia(null);
            toggleCreateSpot();
        }
    };

    const { data: overview } = useQuery(
        orpc.spots.getSpotOverview.queryOptions({ input: { id: spotId! }, enabled: spotId != null, retry: false }),
    );

    useEffect(() => {
        if (overview != null && mapLoaded) {
            setSpotOverview(overview);
            setFirstLoad((value) => {
                if (value) {
                    centerToSpot(overview.spot);
                    return !value;
                }
                return value;
            });
        }
    }, [overview, centerToSpot, mapLoaded, setSpotOverview]);

    const enableSpotQuery = useMemo(() => {
        if (!mapLoaded) {
            return false;
        }

        if (!isEmpty(id)) {
            return false;
        }

        if (viewport.zoom <= ZOOM_DISPLAY_WARNING) {
            return false;
        }

        return true;
    }, [id, viewport?.zoom, mapLoaded]);

    const {
        data: spots,
        refetch,
        isFetching: spotsGeoJSONLoading,
    } = useSpotsGeoJSON(mapRef?.current ?? undefined, enableSpotQuery);

    const shouldFetchWithMedia = useMemo(() => {
        if (isEmpty(customMapInfo)) return undefined;
        if (isEmpty(customMapInfo?.categories)) return true;

        return !intersects(
            [CustomMapCategory.maps, CustomMapCategory.skatepark, CustomMapCategory.shop],
            customMapInfo!.categories,
        );
    }, [customMapInfo]);

    const { data: spotsByTags, isFetching: spotsTagsLoading } = useQuery(
        orpc.spots.listByTags.queryOptions({
            input: {
                tags: isEmpty(id) ? [] : [id!],
                tagsFromMedia: shouldFetchWithMedia ?? false,
            },
            enabled: !isEmpty(id) && shouldFetchWithMedia !== undefined,
        }),
    );

    const onFullSpotClose = () => {
        setSpotID(spotId);
        setModalVisible(null);
        setMedia(null);
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
    }, [spotsByTags, id, isMobile]);

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

    const isLoading = spotsGeoJSONLoading || spotsTagsLoading;

    return (
        <div ref={fullSpotContainerRef} className="relative grow flex bg-tertiary-dark overflow-hidden">
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
                            <MapCustomPanel map={customMapInfo} spots={spotsByTags ?? []} />
                        ) : city ? (
                            <CityPanel />
                        ) : (
                            <MapNavigation handleCreateSpotClick={onToggleSpotCreation} />
                        )}
                        {!isMobile && <QuickAccessDesktop />}
                        {viewport.zoom <= ZOOM_DISPLAY_WARNING && id == null && <MapZoomAlert />}
                        {isLoading && (
                            <div className="absolute bottom-24 left-6 tablet:left-8 tablet:bottom-28 flex items-center gap-2 text-gray-400 text-sm">
                                <SpinnerCircle className="stroke-gray-400 w-3.5" />
                                <span>loading spots</span>
                            </div>
                        )}
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
        </div>
    );
};

export default MapContainer;
