import axios from 'axios';
import classNames from 'classnames';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { InteractiveMap, FlyToInterpolator, ViewportProps } from 'react-map-gl';
import { useSelector, useDispatch } from 'react-redux';
import dynamic from 'next/dynamic';
import { useQuery } from 'react-query';

import { Cluster, Spot, Status, Types } from 'lib/carrelageClient';
import { useUserMe } from 'shared/feudartifice/hooks/user';

import Legend from 'components/pages/map/Legend';
import { boxSpotsSearch, getSpotOverview } from 'lib/carrelageClient';
import { mapRefreshEnd, setSpotOverview, setViewport } from 'store/map/actions';
import { FilterStateUtil, FilterState } from 'lib/FilterState';
import MapQuickAccess from './MapQuickAccess';
import MapCustomNavigation from './MapCustom/MapCustomNavigation';
import MapNavigation from './MapNavigation';
import MapGradients from './MapGradients';
import { RootState } from 'store/reducers';
import { flyTo, updateUrlParams } from 'store/map/thunk';
import { SubscriptionStatus } from 'shared/feudartifice/types';

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
    // const map = useSelector((state: Typings.RootState) => state.map);
    const status = useSelector((state: RootState) => state.map.status);
    const types = useSelector((state: RootState) => state.map.types);
    const viewport = useSelector((state: RootState) => state.map.viewport);
    const dispatch = useDispatch();

    /** Spot ID in the query */
    const id = useSelector((state: RootState) => state.map.customMapId);
    const spotId = useSelector((state: RootState) => state.map.selectSpot);
    const modalVisible = useSelector((state: RootState) => state.map.modalVisible);

    const [clusters, setClusters] = useState<Cluster[]>([]);
    const [, setFirstLoad] = useState(() => (spotId ? true : false));
    const { data: userMe } = useUserMe({ retry: 0 });

    const { data: customMapInfo, isLoading: customMapLoading } = useQuery(
        ['load-custom-map', id],
        async ({ queryKey }) => {
            const [, customMapId] = queryKey;
            if (customMapId == null) {
                return null;
            }
            const response = await axios.get('/api/custom-maps', { params: { id: customMapId } });
            const customMap = response.data;
            return {
                ...customMap,
                clusters: customMap.spots.map((spot) => ({
                    id: spot.id,
                    latitude: spot.location.latitude,
                    longitude: spot.location.longitude,
                    count: 1,
                    spots: [spot],
                })),
            };
        },
    );

    // Full spot
    const fullSpotContainerRef = useRef<HTMLDivElement>();

    const mapRef = useRef<InteractiveMap>();
    const loadTimeout = useRef<NodeJS.Timeout>();

    const centerToSpot = useCallback(
        (spot: Spot) => {
            const newViewport: Partial<ViewportProps> = {
                longitude: spot.location.longitude,
                latitude: spot.location.latitude,
                zoom: 14,
                transitionDuration: 1500,
                transitionInterpolator: new FlyToInterpolator(),
            };
            dispatch(setViewport(newViewport));
        },
        [dispatch],
    );

    const refreshMap = useCallback(
        (_clusters: Cluster[] | undefined = undefined) => {
            setClusters((clusters) => {
                const filteredClusters = filterClusters(_clusters ?? clusters, types, status);

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

        // We are in path `/map`
        if (id === undefined) {
            loadTimeout.current = setTimeout(async () => {
                if (mapRef.current) {
                    const map = mapRef.current.getMap();
                    const bounds = map.getBounds();
                    const northEast = bounds.getNorthEast();
                    const southWest = bounds.getSouthWest();

                    const newSpots = ((await boxSpotsSearch({
                        clustering: false,
                        northEastLatitude: northEast.lat,
                        northEastLongitude: northEast.lng,
                        southWestLatitude: southWest.lat,
                        southWestLongitude: southWest.lng,
                    })) as any[]) as Spot[];

                    const newClusters = newSpots.map((spot): any => ({
                        id: spot.id,
                        latitude: spot.location.latitude,
                        longitude: spot.location.longitude,
                        count: 1,
                        spots: [spot],
                    }));

                    refreshMap(mergeClusters(clusters, newClusters));
                }
            }, 200);
        }
    }, [clusters, id, refreshMap]);

    const onFullSpotClose = () => {
        dispatch(setSpotOverview(undefined));
        dispatch(updateUrlParams({ spotId: null, modal: false }));
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
            dispatch(flyTo(bounds));
        }
    }, [customMapInfo, viewport.width, id, dispatch]);

    /// HELPER TO GET CURRENT BOUNDS OF MAP WHEN NECESSARY
    useEffect(() => {
        if (mapRef.current != null) {
            const map = mapRef.current.getMap();
            const bounds = map.getBounds();
            const sw = bounds.getSouthWest();
            const ne = bounds.getNorthEast();
        }
    }, [mapRef, viewport]);

    return (
        <div
            id="map-container"
            ref={fullSpotContainerRef}
            className={classNames({
                'map-mobile': isMobile,
            })}
        >
            {isMobile ? (
                <div id="map-mobile-message">
                    If you wanna enjoy our skatespots map and you're currently on your mobile, best way is to{' '}
                    <a href="/app" id="map-mobile-message-link">
                        download the app
                    </a>
                </div>
            ) : (
                <>
                    {id !== undefined && customMapInfo !== undefined ? (
                        <MapCustomNavigation
                            id={customMapInfo.id}
                            title={customMapInfo.name}
                            about={customMapInfo.about}
                            subtitle={customMapInfo.subtitle}
                            spots={customMapInfo.spots}
                        />
                    ) : (
                        <>{userMe?.subscriptionStatus === SubscriptionStatus.Active && <MapNavigation />}</>
                    )}
                    <MapQuickAccess />
                    <Legend />
                    {userMe?.subscriptionStatus === SubscriptionStatus.Active && (
                        <MapFullSpot
                            open={modalVisible}
                            onClose={onFullSpotClose}
                            container={fullSpotContainerRef.current}
                        />
                    )}
                    <DynamicMapComponent mapRef={mapRef} clusters={customMapLoading ? [] : clusters} />
                    <MapGradients />
                </>
            )}
        </div>
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
