import axios from 'axios';
import classNames from 'classnames';
import React, { useState, useEffect, useRef } from 'react';
import { InteractiveMap, FlyToInterpolator, ViewportProps } from 'react-map-gl';
import { useSelector, useDispatch } from 'react-redux';
import WebMercatorViewport, { getDistanceScales } from 'viewport-mercator-project';
import dynamic from 'next/dynamic';

import Typings from 'Types';

import { Cluster, Spot, Status, SpotOverview, Types } from 'lib/carrelageClient';

import Legend from 'components/pages/map/Legend';
import BannerTop from 'components/Ui/Banners/BannerTop';
import { boxSpotsSearch, getSpotOverview } from 'lib/carrelageClient';
import { mapRefreshEnd, setViewport } from 'store/map/actions';
import { FilterStateUtil, FilterState } from 'lib/FilterState';
import MapCustomNavigationTrail from './MapCustom/MapCustomNavigationTrail/MapCustomNavigationTrail';
import MapCustomNavigation from './MapCustom/MapCustomNavigation';
import MapNavigation from './MapNavigation';
import MapGradients from './MapGradients';
import { useRouter } from 'next/router';

const DynamicMapComponent = dynamic(() => import('./MapComponent'), { ssr: false });

const filterClusters = (
    clusters: Cluster[],
    types: Record<Types, FilterState>,
    status: Record<Status, FilterState>,
): Cluster[] => {
    let selectedTypes = FilterStateUtil.getSelected(types);
    let selectedStatus = FilterStateUtil.getSelected(status);

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
    const [isMobile, map] = useSelector((state: Typings.RootState) => [state.settings.isMobile, state.map]);
    const dispatch = useDispatch();

    const router = useRouter();
    const id = router.query.id === undefined ? undefined : String(router.query.id);

    const [clusters, setClusters] = useState<Cluster[]>([]);
    const [pixelsPerDegree, setPixelsPerDegree] = useState([0, 0, 0]);
    const [clusterMaxSpots, setClusterMaxSpots] = useState(1);
    const [selectedSpotOverview, setSelectedSpot] = useState<SpotOverview>();
    const [customMapInfo, setCustomMapInfo] = useState<Record<string, any>>();

    const mapRef = useRef<InteractiveMap>();
    const loadTimeout = useRef<NodeJS.Timeout>();

    const refreshMap = (_clusters: Cluster[] | undefined = undefined) => {
        const filteredClusters = filterClusters(_clusters ?? clusters, map.types, map.status);

        dispatch(mapRefreshEnd());

        let clusterMaxSpots = 1;
        for (const cluster of filteredClusters) {
            if (clusterMaxSpots < cluster.count) {
                clusterMaxSpots = cluster.count;
            }
        }
        setClusters(filteredClusters);
        setClusterMaxSpots(clusterMaxSpots);
    };

    const load = () => {
        clearTimeout(loadTimeout.current);

        // We are in path `/map`
        if (id === undefined) {
            loadTimeout.current = setTimeout(async () => {
                if (mapRef.current) {
                    const map = mapRef.current.getMap();
                    const bounds = map.getBounds();
                    const northEast = bounds.getNorthEast();
                    const southWest = bounds.getSouthWest();

                    let newClusters = await boxSpotsSearch({
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

                const bounds = customMap.spots.map((spot) => [spot.location.longitude, spot.location.latitude]);
                const { longitude, latitude, zoom } = new WebMercatorViewport(map.viewport).fitBounds(bounds, {
                    padding: 100,
                });
                const newViewport: Partial<ViewportProps> = {
                    ...map.viewport,
                    longitude,
                    latitude,
                    zoom,
                    transitionDuration: 'auto',
                    transitionInterpolator: new FlyToInterpolator(),
                };
                dispatch(setViewport(newViewport));
            };
            loadCustomMap();
        }
    };

    const flyTo = (spot: Spot) => {
        const viewport: Partial<ViewportProps> = {
            ...map.viewport,
            latitude: spot.location.latitude,
            longitude: spot.location.longitude,
            transitionDuration: 1000,
            transitionInterpolator: new FlyToInterpolator(),
        };

        dispatch(setViewport(viewport));
    };

    const onSpotMarkerClick = async (spot: Spot) => {
        try {
            const spotOverview = await getSpotOverview(spot.id);
            setSelectedSpot(spotOverview);
        } catch (err) {
            // console.log(err);
        }
    };

    const onViewportChange = (viewport: { latitude: number; longitude: number; zoom: number }) => {
        dispatch(setViewport(viewport));
        setPixelsPerDegree(getDistanceScales(viewport).pixelsPerDegree);
        // Avoid loop when the viewport is changed when in Custom Map mode
        if (id === undefined) {
            load();
        }
    };

    const onPopupClose = () => {
        setSelectedSpot(undefined);
    };

    useEffect(() => {
        load();
    }, [map.status, map.types, id]);

    useEffect(() => {
        const { selectedSpot } = map;

        if (selectedSpot) {
            flyTo(selectedSpot);
            onSpotMarkerClick(selectedSpot);
        }
    }, [map.selectedSpot]);

    return (
        <div
            id="map-container"
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
                    <DynamicMapComponent
                        mapRef={mapRef}
                        clusters={clusters}
                        selectedSpotOverview={selectedSpotOverview}
                        onSpotMarkerClick={onSpotMarkerClick}
                        onViewportChange={onViewportChange}
                        onPopupClose={onPopupClose}
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

export default MapContainer;
