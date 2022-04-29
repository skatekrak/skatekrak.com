import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapRef } from 'react-map-gl';
import { useSelector } from 'react-redux';
import dynamic from 'next/dynamic';

import { Cluster, Spot, Status, Types } from 'lib/carrelageClient';

import { boxSpotsSearch, getSpotOverview } from 'lib/carrelageClient';
import { mapRefreshEnd, setSpotOverview, updateUrlParams } from 'store/map/slice';
import { FilterStateUtil, FilterState } from 'lib/FilterState';
import { RootState } from 'store';
import useCustomMap from 'lib/hook/use-custom-map';

import MapQuickAccessDesktop from './mapQuickAccess/MapQuickAccessDesktop';
import MapCustomNavigation from './MapCustom/MapCustomNavigation';
import MapNavigation from './MapNavigation';
import MapBottomNav from './MapBottomNav';
import MapGradients from './MapGradients';
import * as S from './Map.styled';
import { useAppDispatch } from 'store/hook';

const DynamicMapComponent = dynamic(() => import('./MapComponent'), { ssr: false });
const MapFullSpot = dynamic(() => import('./MapFullSpot'), { ssr: false });

const filterClusters = (
    clusters: Cluster[],
    types: Record<Types, FilterState>,
    status: Record<Status, FilterState>,
): Cluster[] => {
    const selectedTypes = FilterStateUtil.getSelected(types);
    const selectedStatus = FilterStateUtil.getSelected(status);

    return clusters
        .map((cluster) => {
            return {
                ...cluster,
                spots: cluster.spots.filter((spot) => {
                    if (spot.status === Status.Active) {
                        return selectedTypes.indexOf(spot.type) !== -1;
                    } else {
                        return selectedStatus.indexOf(spot.status) !== -1;
                    }
                }),
            };
        })
        .filter((cluster) => cluster.spots.length > 0);
};

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

    const [clusters, setClusters] = useState<Cluster[]>([]);
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
        (_clusters: Cluster[] | undefined = undefined) => {
            setClusters(() => {
                const filteredClusters = filterClusters(_clusters ?? [], types, status);

                dispatch(mapRefreshEnd());

                return filteredClusters;
            });
        },
        [dispatch, types, status],
    );

    useEffect(() => {
        if (customMapInfo && customMapInfo.clusters) {
            refreshMap(customMapInfo.clusters);
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

                    const newClusters = await boxSpotsSearch({
                        clustering: true,
                        northEastLatitude: northEast.lat,
                        northEastLongitude: northEast.lng,
                        southWestLatitude: southWest.lat,
                        southWestLongitude: southWest.lng,
                    });

                    refreshMap(newClusters);
                }
            }, 200);
        }
    }, [id, refreshMap]);

    const onFullSpotClose = () => {
        dispatch(setSpotOverview(undefined));
        dispatch(updateUrlParams({ spotId: null, modal: false, customMapId: null }));
    };

    useEffect(() => {
        if (id === undefined) {
            load();
        }
    }, [status, types, id, viewport, load]);

    useEffect(() => {
        if (mapRef.current != null && id !== undefined && customMapInfo !== undefined) {
            const bounds = findBoundsCoordinate(
                customMapInfo.spots.map((spot) => [spot.location.longitude, spot.location.latitude]),
            );
            mapRef.current?.fitBounds(bounds, { padding: 0.15, duration: 1500 });
        }
    }, [customMapInfo, viewport.width, id, dispatch]);

    return (
        <S.MapContainer ref={fullSpotContainerRef}>
            <>
                <MapBottomNav isMobile={isMobile} />
                <MapFullSpot open={modalVisible} onClose={onFullSpotClose} container={fullSpotContainerRef.current} />
                <DynamicMapComponent mapRef={mapRef} clusters={customMapLoading ? [] : clusters}>
                    {id !== undefined && customMapInfo !== undefined ? (
                        <MapCustomNavigation
                            id={customMapInfo.id}
                            title={customMapInfo.name}
                            about={customMapInfo.about}
                            subtitle={customMapInfo.subtitle}
                            spots={customMapInfo.spots}
                        />
                    ) : (
                        <MapNavigation />
                    )}
                    {!isMobile && <MapQuickAccessDesktop />}
                </DynamicMapComponent>
                <MapGradients />
            </>
        </S.MapContainer>
    );
};

function mergeClusters(array1: Cluster[], array2: Cluster[]): Cluster[] {
    const array: Cluster[] = array1;

    for (const cluster of array2) {
        if (array.findIndex((c) => c.id === cluster.id) === -1) {
            array.push(cluster);
        }
    }

    return array;
}

function findBoundsCoordinate(coordinates: [[number, number]]): [[number, number], [number, number]] {
    const northEastLatitude = Math.max(...coordinates.map((c) => c[1]));
    const northEastLongitude = Math.max(...coordinates.map((c) => c[0]));
    const southWestLatitude = Math.min(...coordinates.map((c) => c[1]));
    const southWestLongitude = Math.min(...coordinates.map((c) => c[0]));

    return [
        [northEastLongitude, northEastLatitude],
        [southWestLongitude, southWestLatitude],
    ];
}

export default MapContainer;
