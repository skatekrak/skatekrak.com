import { useEffect } from 'react';
import { Layer, MapLayerMouseEvent, useMap } from 'react-map-gl';
import { Status, Types } from 'shared/feudartifice/types';
import { useAppSelector } from 'store/hook';
import { useTheme } from 'styled-components';
import { ZOOM_DISPLAY_DOTS } from '../Map.constant';

/**
 * mapgl layer to display small pin representing the spot
 * @returns JSX.Element
 */
const SmallLayer = () => {
    const theme = useTheme();
    const isCreateSpotOpen = useAppSelector((state) => state.map.isCreateSpotOpen);
    const { current: map } = useMap();

    useEffect(() => {
        const onMapLayerClick = (event: MapLayerMouseEvent) => {
            if (event.features.length > 0) {
                map.flyTo({
                    zoom: ZOOM_DISPLAY_DOTS + 1,
                    center: {
                        lat: event.lngLat.lat,
                        lng: event.lngLat.lng,
                    },
                });
            }
        };

        map.on('click', 'spot-small-point', onMapLayerClick);

        return () => {
            map.off('click', 'spot-small-point', onMapLayerClick);
        };
    }, []);

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
                    theme.color.map.rip.default,
                    Status.Wip,
                    theme.color.map.wip.default,
                    Types.Street,
                    theme.color.map.street.default,
                    Types.Park,
                    theme.color.map.park.default,
                    Types.Diy,
                    theme.color.map.diy.default,
                    Types.Private,
                    theme.color.map.private.default,
                    Types.Shop,
                    theme.color.map.shop.default,
                    '#000', // fallback color
                ],
            }}
        />
    );
};

export default SmallLayer;
