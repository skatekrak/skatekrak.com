import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactMapGL, { NavigationControl, ContextViewportChangeHandler } from 'react-map-gl';

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
} from 'store/map/actions';
import type { RootState } from 'store/reducers';
import { useIsSubscriber } from 'shared/feudartifice/hooks/user';

const MIN_ZOOM_LEVEL = 2;
const MAX_ZOOM_LEVEL = 18;

type MapComponentProps = {
    mapRef?: React.RefObject<ReactMapGL>;
    clusters: Cluster[];
};

const MapComponent = ({ mapRef, clusters }: MapComponentProps) => {
    const dispatch = useDispatch();
    const viewport = useSelector((state: RootState) => state.map.viewport);
    const spotId = useSelector((state: RootState) => state.map.selectSpot);
    const customMapId = useSelector((state: RootState) => state.map.customMapId);
    const selectedSpotOverview = useSelector((state: RootState) => state.map.spotOverview);
    const clustering = customMapId === undefined;
    const { data: isSubscriber } = useIsSubscriber();

    const markers = useMemo(() => {
        const _markers: JSX.Element[] = [];
        for (const cluster of clusters) {
            if (!clustering || (viewport.zoom > viewport.maxZoom - 5.5 && cluster.spots.length > 0)) {
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
    }, [clusters, selectedSpotOverview, clustering, viewport.zoom, viewport.maxZoom]);

    const onPopupClick = () => {
        if (isSubscriber) {
            dispatch(toggleSpotModal(true));
            dispatch(toggleLegend(false));
            dispatch(toggleSearchResult(false));
        }
    };

    const onPopupClose = () => {
        dispatch(selectSpot());
        dispatch(setSpotOverview(undefined));
    };

    const onViewportChange: ContextViewportChangeHandler = (viewState) => {
        dispatch(setViewport(viewState));
    };

    return (
        <S.MapComponent>
            <ReactMapGL
                ref={mapRef}
                {...viewport}
                width="100%"
                height="100%"
                minZoom={MIN_ZOOM_LEVEL}
                maxZoom={MAX_ZOOM_LEVEL}
                mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
                mapStyle="mapbox://styles/mapbox/dark-v9"
                onViewportChange={onViewportChange}
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

                {/* Marker */}
                {markers}

                <S.MapControlContainer>
                    <NavigationControl />
                </S.MapControlContainer>
            </ReactMapGL>
        </S.MapComponent>
    );
};

export default MapComponent;
