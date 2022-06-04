import { Layer } from 'react-map-gl';
import { Status, Types } from 'shared/feudartifice/types';
import { useTheme } from 'styled-components';
import { MIN_ZOOM_DISPLAY_SPOT } from '../Map.constant';

/**
 * mapgl layer to display small pin representing the spot
 * @returns JSX.Element
 */
const SmallLayer = () => {
    const theme = useTheme();

    return (
        <Layer
            id="spot-small-point"
            source="spots"
            type="circle"
            maxzoom={MIN_ZOOM_DISPLAY_SPOT}
            paint={{
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
