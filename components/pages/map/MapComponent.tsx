import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import ReactMapGL, { MapRef, NavigationControl, ViewStateChangeEvent } from 'react-map-gl';

import SpotCluster from 'components/pages/map/marker/SpotCluster';
import SpotMarker from 'components/pages/map/marker/SpotMarker';
import MapSpotOverview from './MapSpotOverview';
import * as S from './Map.styled';

import { Cluster } from 'lib/carrelageClient';
import {
    selectSpot,
    setSpotOverview,
    setViewport,
    toggleLegend,
    toggleSearchResult,
    toggleSpotModal,
} from 'store/map/slice';
import { useAppSelector } from 'store/hook';

const MIN_ZOOM_LEVEL = 2;
const MAX_ZOOM_LEVEL = 18;

type MapComponentProps = {
    mapRef?: React.RefObject<MapRef>;
    clusters: Cluster[];
    children?: React.ReactNode;
};

const MapComponent = ({ mapRef, clusters, children }: MapComponentProps) => {
    const dispatch = useDispatch();
    const viewport = useAppSelector((state) => state.map.viewport);
    const spotId = useAppSelector((state) => state.map.selectSpot);
    const customMapId = useAppSelector((state) => state.map.customMapId);
    const selectedSpotOverview = useAppSelector((state) => state.map.spotOverview);
    const clustering = customMapId === undefined;

    const markers = useMemo(() => {
        const _markers: JSX.Element[] = [];
        for (const cluster of clusters) {
            if (!clustering || (viewport.zoom > MAX_ZOOM_LEVEL - 5.5 && cluster.spots.length > 0)) {
                for (const spot of cluster.spots) {
                    if (_markers.findIndex((m) => m.key === spot.id) === -1) {
                        _markers.push(
                            <SpotMarker
                                key={spot.id}
                                spot={spot}
                                isSelected={selectedSpotOverview ? selectedSpotOverview.spot.id === spot.id : false}
                            />,
                        );
                    }
                }
            } else {
                _markers.push(<SpotCluster key={cluster.id} cluster={cluster} viewportZoom={viewport.zoom} />);
            }
        }
        return _markers;
    }, [clusters, selectedSpotOverview, clustering, viewport.zoom]);

    const onPopupClick = () => {
        dispatch(toggleSpotModal(true));
        dispatch(toggleLegend(false));
        dispatch(toggleSearchResult(false));
    };

    const onPopupClose = useCallback(() => {
        console.log('map popupOnClose');
        if (spotId != null) {
            dispatch(selectSpot());
        }
        if (selectedSpotOverview != null) {
            dispatch(setSpotOverview(undefined));
        }
    }, [dispatch, spotId, selectedSpotOverview]);

    const onViewportChange = (viewState: ViewStateChangeEvent) => {
        dispatch(setViewport(viewState.viewState));
    };

    return (
        <S.MapComponent>
            <ReactMapGL
                ref={mapRef}
                {...viewport}
                style={{ width: '100%', height: '100%' }}
                minZoom={MIN_ZOOM_LEVEL}
                maxZoom={MAX_ZOOM_LEVEL}
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
                mapStyle="mapbox://styles/mapbox/dark-v9"
                onMove={onViewportChange}
                onClick={onPopupClose}
            >
                {/* Popup */}
                {spotId != null && selectedSpotOverview != null && (
                    <MapSpotOverview
                        spotOverview={selectedSpotOverview}
                        onPopupClick={onPopupClick}
                        onPopupClose={onPopupClose}
                    />
                )}
                {children}

                {/* Marker */}
                {markers}

                <NavigationControl position="bottom-right" />
            </ReactMapGL>
        </S.MapComponent>
    );
};

export default MapComponent;
