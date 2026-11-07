import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { draw, isEmpty } from 'radash';
import { ElementRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MapRef } from 'react-map-gl/maplibre';
import { useShallow } from 'zustand/react/shallow';

import type { Spot } from '@krak/contracts';

import { MapZoomAlert, mapOverlayPanelWidthPx } from '@/components/pages/map/_components';
import CityPanel from '@/components/pages/map/cities/CityPanel';
import CountryPanel from '@/components/pages/map/countries/CountryPanel';
import MapCustomPanel from '@/components/pages/map/MapCustom/panel/MapCustomPanel';
import { SpinnerCircle } from '@/components/Ui/Icons/Spinners';
import useSession from '@/lib/hook/carrelage/use-session';
import {
    useCityID,
    useCountryID,
    useCustomMapID,
    useMediaID,
    useSpotID,
    useSpotModal,
    useViewport,
} from '@/lib/hook/queryState';
import { useSpotsGeoJSON } from '@/lib/hook/useSpotsGeoJSON';
import { centerFromBounds, findSpotsBoundsCoordinate, spotToGeoJSON } from '@/lib/map/helpers';
import { orpc } from '@/server/orpc/client';
import { useMapStore } from '@/store/map';
import { useSettingsStore } from '@/store/settings';

import { MIN_ZOOM_LEVEL, ZOOM_DISPLAY_WARNING } from './Map.constant';
import MapBottomNav from './MapBottomNav/MapBottomNav';
import MapCreateSpot from './MapCreateSpot';
import MapExplorePanel from './MapExplorePanel';
import MapGradients from './MapGradients';
import MapNavigation from './MapNavigation';
import QuickAccessDesktop from './mapQuickAccess/desktop/quick-access-desktop';

const DynamicMapComponent = dynamic(() => import('./MapComponent'), { ssr: false });
const MapFullSpot = dynamic(() => import('./MapFullSpot'), { ssr: false });

const MapContainer = () => {
    const isMobile = useSettingsStore((state) => state.isMobile);
    const [isCreateSpotOpen, isSidePanelOpen, toggleCreateSpot, toggleSidePanel, setSpotOverview] = useMapStore(
        useShallow((state) => [
            state.isCreateSpotOpen,
            state.isSidePanelOpen,
            state.toggleCreateSpot,
            state.toggleSidePanel,
            state.setSpotOverview,
        ]),
    );
    const [viewport, setViewport] = useViewport();
    const session = useSession();
    const router = useRouter();
    const { data: cities = [] } = useQuery(orpc.cities.list.queryOptions({}));
    const {
        data: countries = [],
        isPending: countriesLoading,
        isError: countriesError,
        refetch: refetchCountries,
    } = useQuery(orpc.countries.list.queryOptions({}));
    const initialViewportSet = useRef(false);

    /** Spot ID in the query */
    const [id, setCustomMapID] = useCustomMapID();
    const [city] = useCityID();
    const [countryId, setCountryID] = useCountryID();
    // Old ?id=country-slug links continue to open migrated destinations.
    const selectedCountry = countries.find((country) => country.id === (countryId ?? id));
    const countrySelected = countryId != null || selectedCountry != null;
    const [spotId, setSpotID] = useSpotID();
    const [modalVisible, setModalVisible] = useSpotModal();
    const [, setMedia] = useMediaID();

    const hasExplicitViewport =
        router.query.latitude != null ||
        router.query.longitude != null ||
        router.query.id != null ||
        router.query.city != null ||
        router.query.country != null;

    useEffect(() => {
        if (initialViewportSet.current || hasExplicitViewport || cities.length === 0) return;

        initialViewportSet.current = true;
        const randomCity = draw(cities);
        if (randomCity != null) {
            const center = centerFromBounds(randomCity.bounds);
            setViewport({ latitude: center.latitude, longitude: center.longitude, zoom: 12.6 });
        }
    }, [cities, hasExplicitViewport, setViewport]);

    useEffect(() => {
        if ((id != null || city != null || countrySelected || isCreateSpotOpen) && isSidePanelOpen) {
            toggleSidePanel(false);
        }
    }, [id, city, countrySelected, isSidePanelOpen, toggleSidePanel, isCreateSpotOpen]);

    const [, setFirstLoad] = useState(() => Boolean(spotId));
    const [mapLoaded, setMapLoaded] = useState(false);

    const { data: customMapInfo } = useQuery(
        orpc.maps.fetch.queryOptions({
            input: { id: id ?? '' },
            enabled: !!id && !countrySelected && !countriesLoading,
        }),
    );

    useEffect(() => {
        if (countrySelected) setSpotOverview(null);
    }, [countrySelected, setSpotOverview]);

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
            setSpotID(null);
            setModalVisible(null);
            setMedia(null);
            toggleCreateSpot();
        }
    };

    const { data: overview } = useQuery(
        orpc.spots.getSpotOverview.queryOptions({
            input: { id: spotId! },
            enabled: spotId != null && !countrySelected,
            retry: false,
        }),
    );

    useEffect(() => {
        if (overview != null && mapLoaded && !countrySelected) {
            setSpotOverview(overview);
            setFirstLoad((value) => {
                if (value) {
                    centerToSpot(overview.spot);
                    return !value;
                }
                return value;
            });
        }
    }, [overview, centerToSpot, mapLoaded, setSpotOverview, countrySelected]);

    const enableSpotQuery = useMemo(() => {
        if (!mapLoaded || countrySelected) {
            return false;
        }

        if (!isEmpty(id)) {
            return false;
        }

        if (viewport.zoom <= ZOOM_DISPLAY_WARNING) {
            return false;
        }

        return true;
    }, [id, viewport?.zoom, mapLoaded, countrySelected]);

    const {
        data: spots,
        bounds: feedBounds,
        isFetching: spotsGeoJSONLoading,
    } = useSpotsGeoJSON(mapRef?.current ?? undefined, enableSpotQuery, {
        left: !isMobile && isSidePanelOpen ? mapOverlayPanelWidthPx : 0,
    });

    const { data: spotsByTags, isFetching: spotsTagsLoading } = useQuery(
        orpc.spots.listByTags.queryOptions({
            input: {
                tags: isEmpty(id) ? [] : [id!],
            },
            enabled: !isEmpty(id) && !isEmpty(customMapInfo) && !countrySelected,
            refetchOnWindowFocus: false,
        }),
    );

    const onFullSpotClose = () => {
        setModalVisible(null);
        setMedia(null);
    };

    useEffect(() => {
        if (!countrySelected && mapRef.current != null && id != null && spotsByTags != null && !isEmpty(spotsByTags)) {
            const bounds = findSpotsBoundsCoordinate(spotsByTags);
            console.log('bounds', bounds);
            mapRef.current?.fitBounds(bounds, {
                padding: isMobile ? { bottom: 100, left: 20, right: 20, top: 200 } : 254,
                duration: 1500,
            });
        }
    }, [spotsByTags, id, isMobile, countrySelected]);

    useEffect(() => {
        const map = mapRef.current?.getMap();
        if (!mapLoaded || !countrySelected || !map) return;

        // Allow space beyond the world edges so wide zones can fit portrait screens.
        map.transform.setConstrainOverride((center, zoom) => {
            const boundedCenter = center.wrap();
            boundedCenter.lat = Math.max(-85.051129, Math.min(85.051129, boundedCenter.lat));
            return {
                center: boundedCenter,
                zoom: Math.max(map.getMinZoom(), Math.min(map.getMaxZoom(), zoom)),
            };
        });
        return () => map.transform.setConstrainOverride(null);
    }, [countrySelected, mapLoaded]);

    useEffect(() => {
        if (!mapLoaded || !selectedCountry) return;
        const [[longitude1, latitude1], [longitude2, latitude2]] = selectedCountry.bounds;
        mapRef.current?.fitBounds(
            [
                [Math.min(longitude1, longitude2), Math.min(latitude1, latitude2)],
                [Math.max(longitude1, longitude2), Math.max(latitude1, latitude2)],
            ],
            {
                padding: isMobile
                    ? { top: 80, bottom: 100, left: 24, right: 24 }
                    : { top: 32, bottom: 96, left: mapOverlayPanelWidthPx + 32, right: 96 },
                duration: 1500,
            },
        );
    }, [selectedCountry, mapLoaded, isMobile]);

    useEffect(() => {
        if (!mapLoaded || id != null || city == null || countrySelected) return;

        const selectedCity = cities.find((item) => item.id === city);
        if (selectedCity == null) return;

        const center = centerFromBounds(selectedCity.bounds);
        mapRef.current?.flyTo({
            center: { lat: center.latitude, lng: center.longitude },
            padding: 0,
            duration: 1500,
            zoom: 11.7,
        });
    }, [cities, city, id, mapLoaded, countrySelected]);

    const displayedSpots = useMemo(() => {
        if (countrySelected) return [];
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
    }, [spots, id, viewport.zoom, customMapInfo, spotsByTags, countrySelected]);

    const isLoading = spotsGeoJSONLoading || spotsTagsLoading;

    return (
        <div className="min-h-0 grow flex overflow-hidden">
            <div ref={fullSpotContainerRef} className="relative grow flex bg-tertiary-dark overflow-hidden">
                <DynamicMapComponent
                    mapRef={mapRef}
                    minZoom={countrySelected ? -2 : MIN_ZOOM_LEVEL}
                    spots={displayedSpots}
                    onLoad={() => {
                        setMapLoaded(true);
                    }}
                >
                    {isCreateSpotOpen ? (
                        <MapCreateSpot />
                    ) : (
                        <>
                            {countrySelected ? (
                                <CountryPanel
                                    key={countryId ?? selectedCountry?.id}
                                    country={selectedCountry}
                                    loading={countriesLoading}
                                    error={countriesError}
                                    onRetry={() => {
                                        refetchCountries();
                                    }}
                                    onClose={() => {
                                        setCountryID(null);
                                        if (selectedCountry?.id === id) setCustomMapID(null);
                                    }}
                                />
                            ) : id != null && customMapInfo != null ? (
                                <MapCustomPanel map={customMapInfo} spots={spotsByTags ?? []} />
                            ) : city ? (
                                <CityPanel />
                            ) : (
                                <>
                                    {!isMobile && isSidePanelOpen && <MapExplorePanel bounds={feedBounds} />}
                                    <MapNavigation handleCreateSpotClick={onToggleSpotCreation} />
                                </>
                            )}
                            {!isMobile && <QuickAccessDesktop />}
                            {viewport.zoom <= ZOOM_DISPLAY_WARNING && id == null && !countrySelected && (
                                <MapZoomAlert />
                            )}
                            {isLoading && !countrySelected && (
                                <div className="absolute bottom-24 left-6 tablet:left-8 tablet:bottom-28 flex items-center gap-2 text-gray-400 text-sm">
                                    <SpinnerCircle className="stroke-gray-400 w-3.5" />
                                    <span>loading spots</span>
                                </div>
                            )}
                            <MapBottomNav isMobile={isMobile ?? false} />
                            <MapFullSpot
                                open={!countrySelected && modalVisible}
                                onClose={onFullSpotClose}
                                container={!isMobile ? fullSpotContainerRef.current : null}
                            />
                        </>
                    )}
                </DynamicMapComponent>
                <MapGradients />
            </div>
        </div>
    );
};

export default MapContainer;
