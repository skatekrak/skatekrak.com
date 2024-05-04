import React, { useState, useEffect, useRef, useCallback, useMemo, ElementRef } from 'react';
import { MapRef } from 'react-map-gl';
import dynamic from 'next/dynamic';
import { useShallow } from 'zustand/react/shallow';

import { Spot } from '@krak/carrelage-client';

import { getSpotOverview } from '@krak/carrelage-client';
import { RootState } from '@/store';

import MapQuickAccessDesktop from './mapQuickAccess/MapQuickAccessDesktop';
import MapCustomNavigation from './MapCustom/MapCustomNavigation';
import MapNavigation from './MapNavigation';
import MapBottomNav from './MapBottomNav';
import MapGradients from './MapGradients';
import MapZoomAlert from './MapZoomAlert';
import * as S from './Map.styled';
import { useAppSelector } from '@/store/hook';
import { findSpotsBoundsCoordinate, spotToGeoJSON } from '@/lib/map/helpers';
import { ZOOM_DISPLAY_WARNING } from './Map.constant';
import MapCreateSpot from './MapCreateSpot';
import useSession from '@/lib/hook/carrelage/use-session';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { useSpotsGeoJSON } from '@/shared/feudartifice/hooks/spot';
import { isEmpty, intersects } from 'radash';
import { trpc } from '@/server/trpc/utils';
import { SpinnerCircle } from '@/components/Ui/Icons/Spinners';
import { useCustomMapID, useMediaID, useSpotID, useSpotModal, useViewport } from '@/lib/hook/queryState';
import { useMapStore } from '@/store/map';

const DynamicMapComponent = dynamic(() => import('./MapComponent'), { ssr: false });
const MapFullSpot = dynamic(() => import('./MapFullSpot'), { ssr: false });

const MapContainer = () => {
    const isMobile = useAppSelector((state: RootState) => state.settings.isMobile);
    const [isCreateSpotOpen, toggleCreateSpot, setSpotOverview] = useMapStore(
        useShallow((state) => [state.isCreateSpotOpen, state.toggleCreateSpot, state.setSpotOverview]),
    );
    const [viewport] = useViewport();
    const session = useSession();
    const router = useRouter();

    /** Spot ID in the query */
    const [id] = useCustomMapID();
    const [spotId, setSpotID] = useSpotID();
    const [modalVisible, setModalVisible] = useSpotModal();
    const [, setMedia] = useMediaID();

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
            setSpotID(null);
            setModalVisible(null);
            setMedia(null);
            toggleCreateSpot();
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

        return !intersects(['maps', 'skatepark', 'shop'], customMapInfo!.categories);
    }, [customMapInfo]);

    const { data: spotsByTags, isFetching: spotsTagsLoading } = trpc.spots.listByTags.useQuery(
        {
            tags: isEmpty(id) ? [] : [id!],
            tagsFromMedia: shouldFetchWithMedia,
        },
        { enabled: !isEmpty(id) },
    );

    const onFullSpotClose = () => {
        setSpotID(spotId);
        setModalVisible(null);
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
                        {isLoading && (
                            <div className="absolute bottom-24 left-6 md:left-8 md:bottom-28 flex items-center gap-2 text-gray-400 text-sm">
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
        </S.MapContainer>
    );
};

export default MapContainer;
