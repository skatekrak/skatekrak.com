import { useEffect } from 'react';
import { Layer, MapLayerMouseEvent, useMap } from 'react-map-gl';
import { useQuery } from 'react-query';
import { Status, Types } from 'shared/feudartifice/types';
import { useAppDispatch, useAppSelector } from 'store/hook';
import { selectSpot } from 'store/map/slice';
import { MIN_ZOOM_DISPLAY_SPOT } from '../Map.constant';

type SpotPinLayerProps = {
    type: Types | Status;
};

const SpotPinLayer = ({ type }: SpotPinLayerProps) => {
    const { current: map } = useMap();
    const isCreateSpotOpen = useAppSelector((state) => state.map.isCreateSpotOpen);
    const dispatch = useAppDispatch();

    const { isLoading, isSuccess } = useQuery(
        ['map-load-image', type, map],
        async () => {
            if (!map.hasImage(`/images/map/icons/${type}@2x.png`)) {
                map.loadImage(`/images/map/icons/${type}@2x.png`, (error, image) => {
                    if (error) {
                        throw error;
                    }
                    map.addImage(`spot-${type}`, image);
                });
            }
        },
        {
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
        },
    );

    useEffect(() => {
        const onMapLayerClick = (event: MapLayerMouseEvent) => {
            if (event.features.length > 0) {
                dispatch(selectSpot(event.features[0].properties.spotId));
            }
        };

        map.on('click', `spot-layer-${type}`, onMapLayerClick);

        return () => {
            map.off('click', `spot-layer-${type}`, onMapLayerClick);
        };
    });

    if (isLoading || !isSuccess) {
        return <></>;
    }

    return (
        <Layer
            id={`spot-layer-${type}`}
            source="spots"
            type="symbol"
            minzoom={MIN_ZOOM_DISPLAY_SPOT}
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

export default SpotPinLayer;
