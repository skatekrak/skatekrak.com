import classNames from 'classnames';
import React, { memo, useCallback } from 'react';
import { Popup, useMap } from 'react-map-gl/maplibre';

import type { contract } from '@krak/contracts';

import IconClips from '@/components/Ui/Icons/IconClips';
import IconMedia from '@/components/Ui/Icons/IconMedia';
import { useMapStore } from '@/store/map';

import { MapSpotCover } from '../_components';

import type { InferContractRouterOutputs } from '@orpc/contract';

type SpotOverview = InferContractRouterOutputs<typeof contract>['spots']['getSpotOverview'];

type MapSpotOverviewProps = {
    spotOverview: SpotOverview;
    onPopupClick: () => void;
    onPopupClose: () => void;
};

const MapSpotOverview: React.FC<MapSpotOverviewProps> = ({ spotOverview, onPopupClick, onPopupClose }) => {
    const { current: map } = useMap();
    const mapStyle = useMapStore((state) => state.mapStyle);
    const media = spotOverview.mediaThumbnail;

    const isLightStyle = mapStyle === 'light';

    const handleWheel = useCallback(
        (e: React.WheelEvent) => {
            if (!map) return;
            e.preventDefault();

            // Match map's native scroll speed (MapLibre uses ~1/450)
            const zoomDelta = -e.deltaY / 450;

            // Get mouse position relative to map canvas
            const canvas = map.getCanvas();
            const rect = canvas.getBoundingClientRect();
            const point: [number, number] = [e.clientX - rect.left, e.clientY - rect.top];

            // Convert screen point to geographic coordinates and zoom around that point
            const lngLat = map.unproject(point);

            map.zoomTo(map.getZoom() + zoomDelta, {
                duration: 0,
                around: lngLat,
            });
        },
        [map],
    );

    return (
        <Popup
            className={classNames('map-spot-overview', {
                'map-spot-overview--light': isLightStyle,
            })}
            longitude={spotOverview.spot.location.longitude}
            latitude={spotOverview.spot.location.latitude}
            onClose={onPopupClose}
            closeButton={false}
            closeOnClick={false}
        >
            <button className="relative text-left pointer-events-auto" onClick={onPopupClick} onWheel={handleWheel}>
                <h4
                    className={classNames('max-w-[275px] font-black text-2xl', {
                        'text-black': isLightStyle,
                        'text-white': !isLightStyle,
                    })}
                >
                    {spotOverview.spot.name}
                </h4>
                <MapSpotCover
                    media={media}
                    alt={spotOverview.spot.name}
                    className="w-[275px] mt-2 rounded-sm shadow-onDarkHighSharp"
                    placeholderContainerClassName="mb-10"
                />
                <div className="absolute right-0 bottom-0 left-0 flex items-center gap-4 py-2 px-4 z-1 bg-tertiary-dark/75">
                    <div className="flex items-center">
                        <IconMedia className="w-6 h-6 mr-1 fill-onDark-highEmphasis rounded-full" />
                        <p className="font-bold text-onDark-highEmphasis text-base">
                            {spotOverview.spot.mediasStat.all}
                        </p>
                    </div>
                    <div className="flex items-center">
                        <IconClips className="w-6 h-6 mr-1 fill-onDark-highEmphasis rounded-full" />
                        <p className="font-bold text-onDark-highEmphasis text-base">
                            {spotOverview.spot.clipsStat.all}
                        </p>
                    </div>
                </div>
            </button>
        </Popup>
    );
};

export default memo(MapSpotOverview);
