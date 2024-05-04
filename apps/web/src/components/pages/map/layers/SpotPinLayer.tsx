import { memo, useCallback, useEffect } from 'react';
import { Layer, MapLayerMouseEvent, useMap } from 'react-map-gl';

import { Status, Types } from '@/shared/feudartifice/types';
import { ZOOM_DISPLAY_DOTS } from '../Map.constant';
import { first } from 'radash';
import { useSpotID } from '@/lib/hook/queryState';
import { useMapStore } from '@/store/map';

type SpotPinLayerProps = {
    type: Types | Status;
};

const SpotPinLayer = ({ type }: SpotPinLayerProps) => {
    const { current: map } = useMap();
    const isCreateSpotOpen = useMapStore((state) => state.isCreateSpotOpen);
    const [, setSpotID] = useSpotID();

    useEffect(() => {
        if (!map?.hasImage(`/images/map/icons/${type}@2x.png`)) {
            map?.loadImage(`/images/map/icons/${type}@2x.png`, (error, image) => {
                if (error) {
                    console.error(error);
                } else if (image != null) {
                    map?.addImage(`spot-${type}`, image);
                }
            });
        }
    }, [type, map]);

    const onMapLayerClick = useCallback(
        (event: MapLayerMouseEvent) => {
            if (event.features != null) {
                const feature = first(event.features);
                if (feature != null) {
                    setSpotID(feature.properties?.id);
                }
            }
        },
        [setSpotID],
    );

    useEffect(() => {
        map?.on('click', `spot-layer-${type}`, onMapLayerClick);

        return () => {
            map?.off('click', `spot-layer-${type}`, onMapLayerClick);
        };
    }, [map, type, onMapLayerClick]);

    const filterAttribute = type === Status.Rip || type === Status.Wip ? 'status' : 'type';

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
            filter={['==', filterAttribute, type]}
        />
    );
};

export default memo(SpotPinLayer);
