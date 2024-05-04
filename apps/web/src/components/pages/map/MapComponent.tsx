import React, { useCallback, useMemo, memo } from 'react';
import ReactMapGL, { GeolocateControl, MapRef, NavigationControl, Source, ViewStateChangeEvent } from 'react-map-gl';
import type { FeatureCollection, Geometry } from 'geojson';
import { useShallow } from 'zustand/react/shallow';

import SpotMarker from '@/components/pages/map/marker/SpotMarker';
import MapSpotOverview from './MapSpotOverview';
import * as S from './Map.styled';

import { SpotGeoJSON } from '@krak/carrelage-client';
import { MAX_ZOOM_LEVEL, ZOOM_DISPLAY_DOTS, MIN_ZOOM_LEVEL } from './Map.constant';
import { Status, Types } from '@/shared/feudartifice/types';
import SmallLayer from './layers/SmallLayer';
import SpotPinLayer from './layers/SpotPinLayer';
import { intersects } from 'radash';
import { useSpotID, useSpotModal, useViewport } from '@/lib/hook/queryState';
import { useMapStore } from '@/store/map';

type MapComponentProps = {
    mapRef: React.RefObject<MapRef>;
    onLoad?: () => void;
    spots: SpotGeoJSON[];
    children?: React.ReactNode;
};

const MapComponent = ({ mapRef, spots, children, onLoad }: MapComponentProps) => {
    const [selectedSpotOverview, setSpotOverview, toggleLegend, toggleSearchResult] = useMapStore(
        useShallow((state) => [
            state.spotOverview,
            state.setSpotOverview,
            state.toggleLegend,
            state.toggleSearchResult,
        ]),
    );
    const [viewport, setViewport] = useViewport();
    const [spotId, setSpotId] = useSpotID();
    const [, setModalVisible] = useSpotModal();

    const [markers, spotSourceData]: [JSX.Element[], FeatureCollection<Geometry>] = useMemo(() => {
        const markers: JSX.Element[] = [];
        const spotSourceData: FeatureCollection<Geometry> = {
            type: 'FeatureCollection',
            features: [],
        };

        for (const spot of spots) {
            if (isSpotMarker(spot) && viewport.zoom > ZOOM_DISPLAY_DOTS) {
                markers.push(
                    <SpotMarker
                        key={spot.id}
                        spot={spot}
                        isSelected={selectedSpotOverview ? selectedSpotOverview.spot.id === spot.id : false}
                    />,
                );
            } else {
                spotSourceData.features.push(spot);
            }
        }

        return [markers, spotSourceData];
    }, [spots, selectedSpotOverview, viewport.zoom]);

    const onPopupClick = () => {
        setModalVisible(true);
        toggleLegend(false);
        toggleSearchResult(false);
    };

    const onPopupClose = useCallback(() => {
        if (spotId != null) {
            setSpotId(null);
        }

        if (selectedSpotOverview != null) {
            setSpotOverview(null);
        }
    }, [setSpotOverview, spotId, selectedSpotOverview, setSpotId]);

    const onViewportChange = async (viewState: ViewStateChangeEvent) => {
        await setViewport(viewState.viewState);
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
                mapStyle={'mapbox://styles/mapbox/dark-v11'}
                projection={{ name: 'mercator' }}
                onMove={onViewportChange}
                onLoad={onLoad}
            >
                <Source id="spots" type="geojson" data={spotSourceData}>
                    <SmallLayer />
                    <SpotPinLayer type={Types.Street} />
                    <SpotPinLayer type={Types.Shop} />
                    <SpotPinLayer type={Types.Park} />
                    <SpotPinLayer type={Types.Diy} />
                    <SpotPinLayer type={Types.Private} />
                    <SpotPinLayer type={Status.Rip} />
                    <SpotPinLayer type={Status.Wip} />
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

                {/* Controls */}
                <NavigationControl position="bottom-right" />
                <GeolocateControl position="bottom-right" showAccuracyCircle={false} />
            </ReactMapGL>
        </S.MapComponent>
    );
};

const isSpotMarker = (spot: SpotGeoJSON): boolean => {
    return spot.properties.mediasStat.all >= 10 || intersects(spot.properties.tags, ['history', 'famous', 'minute']);
};

export default memo(MapComponent);
