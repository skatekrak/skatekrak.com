import { memo, useCallback, useEffect } from 'react';
import { Layer, MapLayerMouseEvent, useMap } from 'react-map-gl';
import { Status, Types } from 'shared/feudartifice/types';
import { useAppDispatch, useAppSelector } from 'store/hook';
import { selectSpot } from 'store/map/slice';
import { ZOOM_DISPLAY_DOTS } from '../Map.constant';

type SpotPinLayerProps = {
    type: Types | Status;
};

const SpotPinLayer = ({ type }: SpotPinLayerProps) => {
    const { current: map } = useMap();
    const isCreateSpotOpen = useAppSelector((state) => state.map.isCreateSpotOpen);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!map.hasImage(`/images/map/icons/${type}@2x.png`)) {
            map.loadImage(`/images/map/icons/${type}@2x.png`, (error, image) => {
                if (error) {
                    console.error(error);
                } else {
                    map.addImage(`spot-${type}`, image);
                }
            });
        }
    }, [type, map]);

    const onMapLayerClick = useCallback(
        (event: MapLayerMouseEvent) => {
            if (event.features.length > 0) {
                dispatch(selectSpot(event.features[0].properties.spotId));
            }
        },
        [dispatch],
    );

    useEffect(() => {
        map.on('click', `spot-layer-${type}`, onMapLayerClick);

        return () => {
            map.off('click', `spot-layer-${type}`, onMapLayerClick);
        };
    }, [map, type, onMapLayerClick]);

    return (
        <Layer
            id={`spot-layer-${type}`}
            source="spots"
            type="symbol"
            minzoom={ZOOM_DISPLAY_DOTS}
            layout={{
                'icon-image': `spot-${type}`,
                'icon-size': 0.5,
                'icon-allow-overlap': true,
            }}
            paint={{
                'icon-opacity': isCreateSpotOpen ? 0.5 : 1,
            }}
            filter={['==', 'type', type]}
        />
    );
};

export default memo(SpotPinLayer);
