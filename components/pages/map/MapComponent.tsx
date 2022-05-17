import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import ReactMapGL, { MapRef, NavigationControl, Source, ViewStateChangeEvent } from 'react-map-gl';
import type { FeatureCollection, Geometry } from 'geojson';

import SpotMarker from 'components/pages/map/marker/SpotMarker';
import MapSpotOverview from './MapSpotOverview';
import * as S from './Map.styled';

import { Spot } from 'lib/carrelageClient';
import {
    selectSpot,
    setSpotOverview,
    setViewport,
    toggleLegend,
    toggleSearchResult,
    toggleSpotModal,
} from 'store/map/slice';
import { useAppSelector } from 'store/hook';
import { MAX_ZOOM_LEVEL, MIN_ZOOM_DISPLAY_SPOT, MIN_ZOOM_LEVEL } from './Map.constant';
import { Status } from 'shared/feudartifice/types';
import SmallLayer from './layers/SmallLayer';

type MapComponentProps = {
    mapRef?: React.RefObject<MapRef>;
    spots: Spot[];
    children?: React.ReactNode;
};

const MapComponent = ({ mapRef, spots, children }: MapComponentProps) => {
    const dispatch = useDispatch();
    const viewport = useAppSelector((state) => state.map.viewport);
    const spotId = useAppSelector((state) => state.map.selectSpot);
    const selectedSpotOverview = useAppSelector((state) => state.map.spotOverview);

    const markers = useMemo(() => {
        if (viewport.zoom > MIN_ZOOM_DISPLAY_SPOT) {
            return spots.map((spot) => (
                <SpotMarker
                    key={spot.id}
                    spot={spot}
                    isSelected={selectedSpotOverview ? selectedSpotOverview.spot.id === spot.id : false}
                />
            ));
        }

        return [];
    }, [spots, selectedSpotOverview, viewport.zoom]);

    const spotSourceData: FeatureCollection<Geometry> = useMemo(() => {
        return {
            type: 'FeatureCollection',
            features: spots.map((spot) => ({
                id: spot.id,
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: spot.geo,
                },
                properties: {
                    type: spot.status === Status.Active ? spot.type : spot.status,
                },
            })),
        };
    }, [spots]);

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
                <Source id="spots" type="geojson" data={spotSourceData}>
                    <SmallLayer />
                </Source>
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
