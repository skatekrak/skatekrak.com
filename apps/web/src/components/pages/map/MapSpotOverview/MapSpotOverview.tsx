import classNames from 'classnames';
import React, { memo } from 'react';
import { Popup } from 'react-map-gl/maplibre';

import type { contract } from '@krak/contracts';
import { useImgproxy } from '@krak/ui';
import { getImgproxyUrl } from '@krak/utils';

import IconClips from '@/components/Ui/Icons/IconClips';
import IconMedia from '@/components/Ui/Icons/IconMedia';

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

    return (
        <Popup
            className="map-spot-overview"
            longitude={spotOverview.spot.location.longitude}
            latitude={spotOverview.spot.location.latitude}
            onClose={onPopupClose}
            closeButton={false}
        >
            <button className="map-spot-overview-container" onClick={onPopupClick}>
                <h4
                    className={classNames('map-spot-overview-name', {
                        'map-spot-overview-name-center': !spotOverview.mostLikedMedia,
                    })}
                >
                    {spotOverview.spot.name}
                </h4>
                {spotOverview.mostLikedMedia?.image && (
                    <div className="map-spot-overview-cover-container">
                        <div
                            className="map-spot-overview-cover"
                            style={{
                                backgroundImage: `url("${getOverviewImageUrl(
                                    spotOverview.mostLikedMedia.image,
                                    imgproxy?.baseUrl,
                                )}")`,
                            }}
                        />
                    </div>
                )}
                <div
                    className={classNames('map-spot-overview-overlay', {
                        'map-spot-overview-overlay--relative': !spotOverview.mostLikedMedia,
                    })}
                >
                    <div className="map-spot-overview-overlay-amount-container">
                        <IconMedia />
                        <p className="map-spot-overview-overlay-amount-number">{spotOverview.spot.mediasStat.all}</p>
                    </div>
                    <div className="map-spot-overview-overlay-amount-container">
                        <IconClips />
                        <p className="map-spot-overview-overlay-amount-number">{spotOverview.spot.clipsStat.all}</p>
                    </div>
                </div>
            </button>
        </Popup>
    );
};

export default memo(MapSpotOverview);
