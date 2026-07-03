import classNames from 'classnames';
import React, { memo } from 'react';
import { Popup } from 'react-map-gl/maplibre';

import type { contract } from '@krak/contracts';
import { useImgproxy } from '@krak/ui';
import { getImgproxyUrl } from '@krak/utils';

import IconClips from '@/components/Ui/Icons/IconClips';
import IconMedia from '@/components/Ui/Icons/IconMedia';
import { useMapStore } from '@/store/map';

import MapSpotOverviewPlaceholder from './MapSpotOverviewPlaceholder';

import type { InferContractRouterOutputs } from '@orpc/contract';

type SpotOverview = InferContractRouterOutputs<typeof contract>['spots']['getSpotOverview'];

type MapSpotOverviewProps = {
    spotOverview: SpotOverview;
    onPopupClick: () => void;
    onPopupClose: () => void;
};

function getOverviewImageUrl(
    image: { provider?: string; key?: string; publicId?: string; [key: string]: unknown },
    imgproxyBaseUrl: string | undefined,
): string {
    if (image.provider === 's3' && image.key && imgproxyBaseUrl) {
        return getImgproxyUrl(imgproxyBaseUrl, image.key, {
            width: 275,
            height: 183,
            resizingType: 'fill',
        });
    }
    // Legacy Cloudinary
    return `https://res.cloudinary.com/krak/image/upload/w_275,ar_1.5,c_fill,dpr_auto/${image.publicId}.jpg`;
}

const MapSpotOverview: React.FC<MapSpotOverviewProps> = ({ spotOverview, onPopupClick, onPopupClose }) => {
    const imgproxy = useImgproxy();
    const mapStyle = useMapStore((state) => state.mapStyle);

    const isLightStyle = mapStyle === 'light-v11';

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
            <button className="relative text-left" onClick={onPopupClick}>
                <h4
                    className={classNames('max-w-[275px] font-black text-2xl', {
                        'text-black': isLightStyle,
                        'text-white': !isLightStyle,
                    })}
                >
                    {spotOverview.spot.name}
                </h4>
                <div className="relative w-[275px] mt-2 overflow-hidden bg-tertiary-medium rounded-sm aspect-video shadow-onDarkHighSharp">
                    {spotOverview.mostLikedMedia?.image ? (
                        <div
                            className="absolute inset-0 bg-center bg-cover"
                            style={{
                                backgroundImage: `url("${getOverviewImageUrl(
                                    spotOverview.mostLikedMedia.image,
                                    imgproxy?.baseUrl,
                                )}")`,
                            }}
                        />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center mb-10">
                            <MapSpotOverviewPlaceholder className="w-2/3 [&>path]:fill-onDark-lowEmphasis" />
                        </div>
                    )}
                </div>
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
