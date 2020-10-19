import axios from 'axios';
import classNames from 'classnames';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { InteractiveMap, FlyToInterpolator, ViewportProps } from 'react-map-gl';
import { useSelector, useDispatch } from 'react-redux';
import dynamic from 'next/dynamic';

import Typings from 'Types';

import { Cluster, Spot, Status, Types } from 'lib/carrelageClient';

import Legend from 'components/pages/map/Legend';
import BannerTop from 'components/Ui/Banners/BannerTop';
import { boxSpotsSearch, getSpotOverview } from 'lib/carrelageClient';
import { flyToCustomMap, mapRefreshEnd, setSpotOverview, setViewport } from 'store/map/actions';
import { FilterStateUtil, FilterState } from 'lib/FilterState';
import MapCustomNavigationTrail from './MapCustom/MapCustomNavigationTrail/MapCustomNavigationTrail';
import MapCustomNavigation from './MapCustom/MapCustomNavigation';
import MapNavigation from './MapNavigation';
import MapGradients from './MapGradients';
import { useDispatchRouterQuery, useRouterQuery } from 'lib/url-query-hook';

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
    const isMobile = useSelector((state: Typings.RootState) => state.settings.isMobile);
    const map = useSelector((state: Typings.RootState) => state.map);
    const dispatch = useDispatch();

    /** Spot ID in the query */
    const id = useRouterQuery('id');
    const spotId = useRouterQuery('spot');
    const modal = useRouterQuery('modal');
    const isFullSpotOpen = modal === undefined ? false : Boolean(modal);
    const dispatchQuery = useDispatchRouterQuery();

    const [clusters, setClusters] = useState<Cluster[]>([]);
    const [customMapInfo, setCustomMapInfo] = useState<Record<string, any>>();
    const [firstLoad, setFirstLoad] = useState(() => (spotId ? true : false));

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

    /**
     * If there is a spotId in the URL at launch, we query that spot
     */

    const refreshMap = useCallback(
        (_clusters: Cluster[] | undefined = undefined) => {
            setClusters((clusters) => {
                const filteredClusters = filterClusters(_clusters ?? clusters, map.types, map.status);

                dispatch(mapRefreshEnd());

                return filteredClusters;
            });
        },
        [dispatch, map.types, map.status],
    );

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

                    const newClusters = await boxSpotsSearch({
                        clustering: true,
                        northEastLatitude: northEast.lat,
                        northEastLongitude: northEast.lng,
                        southWestLatitude: southWest.lat,
                        southWestLongitude: southWest.lng,
                    });

                    refreshMap(mergeClusters(clusters, newClusters));
                }
            }, 200);
        } else {
            // We should try to load a custom map
            const loadCustomMap = async () => {
                const response = await axios.get('/api/custom-maps', { params: { id } });
                const customMap = response.data;
                setCustomMapInfo(customMap);
                refreshMap(
                    customMap.spots.map((spot) => ({
                        id: spot.id,
                        latitude: spot.location.latitude,
                        longitude: spot.location.longitude,
                        count: 1,
                        spots: [spot],
                    })),
                );
            };
            loadCustomMap();
        }
    }, [clusters, id, refreshMap]);

    const onViewportChange = useCallback(
        (viewport: { latitude: number; longitude: number; zoom: number }) => {
            dispatch(setViewport(viewport));
            // Avoid loop when the viewport is changed when in Custom Map mode
            if (id === undefined) {
                load();
            }
        },
        [dispatch, id, load],
    );

    const onFullSpotClose = () => {
        dispatchQuery('modal');
    };

    useEffect(() => {
        load();
    }, [map.status, map.types, id]);

    useEffect(() => {
        if (mapRef.current != null && id !== undefined && customMapInfo !== undefined) {
            const bounds = findBoundsCoordinate(
                customMapInfo.spots.map((spot) => [spot.location.longitude, spot.location.latitude]),
            );
            dispatch(flyToCustomMap(bounds));
        }
    }, [customMapInfo, map.viewport.width, id, dispatch]);

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
                    <BannerTop
                        offsetScroll={false}
                        link="/app"
                        text="The world is our playground. Download the app & help us enrich this map."
                    />
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
                    <MapCustomNavigationTrail />
                    <Legend />
                    <MapFullSpot
                        open={isFullSpotOpen}
                        onClose={onFullSpotClose}
                        container={fullSpotContainerRef.current}
                    />
                    <DynamicMapComponent
                        mapRef={mapRef}
                        clusters={clusters}
                        selectedSpotOverview={map.spotOverview}
                        onViewportChange={onViewportChange}
                        clustering={id === undefined}
                    />
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
