import { useEffect } from 'react';
import { Layer, MapLayerMouseEvent, useMap } from 'react-map-gl/maplibre';

import { Status, Types } from '@krak/types';

import { mapColors } from '@/components/pages/map/layers/colors';
import { useMapStore } from '@/store/map';

import { ZOOM_DISPLAY_DOTS } from '../Map.constant';

/**
 * mapgl layer to display small pin representing the spot
 * @returns React.JSX.Element
 */
const SmallLayer = () => {
    const isCreateSpotOpen = useMapStore((state) => state.isCreateSpotOpen);
    const { current: map } = useMap();

    useEffect(() => {
        const onMapLayerClick = (event: MapLayerMouseEvent) => {
            const feature = event.features?.[0];
            if (feature != null && feature.geometry.type === 'Point') {
                const [lng, lat] = feature.geometry.coordinates;
                map?.flyTo({
                    zoom: ZOOM_DISPLAY_DOTS + 1,
                    center: { lng, lat },
                });
            }
        };

        map?.on('click', 'spot-small-point', onMapLayerClick);

        return () => {
            map?.off('click', 'spot-small-point', onMapLayerClick);
        };
    }, [map]);

    return (
        <Layer
            id="spot-small-point"
            source="spots"
            type="circle"
            maxzoom={ZOOM_DISPLAY_DOTS}
            paint={{
                'circle-opacity': isCreateSpotOpen ? 0.5 : 1,
                'circle-radius': 4,
                'circle-stroke-width': 1,
                'circle-stroke-color': '#FFF',
                'circle-color': [
                    'match',
                    ['get', 'type'],
                    Status.Rip,
                    mapColors.rip.default,
                    Status.Wip,
                    mapColors.wip.default,
                    Types.Street,
                    mapColors.street.default,
                    Types.Park,
                    mapColors.park.default,
                    Types.Diy,
                    mapColors.diy.default,
                    Types.Private,
                    mapColors.private.default,
                    Types.Shop,
                    mapColors.shop.default,
                    '#000', // fallback color
                ],
            }}
        />
    );
};

export default SmallLayer;
