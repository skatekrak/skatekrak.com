import React, { memo } from 'react';
import classNames from 'classnames';
import { Popup } from 'react-map-gl';

import IconMedia from '@/components/Ui/Icons/IconMedia';
import IconClips from '@/components/Ui/Icons/IconClips';

import { SpotOverview } from '@krak/carrelage-client';

type MapSpotOverviewProps = {
    spotOverview: SpotOverview;
    onPopupClick: () => void;
    onPopupClose: () => void;
};

const generateCloudinaryURL = (publicId: string): string => {
    return `https://res.cloudinary.com/krak/image/upload/w_275,ar_1.5,c_fill,dpr_auto/${publicId}.jpg`;
};

const MapSpotOverview: React.FC<MapSpotOverviewProps> = ({ spotOverview, onPopupClick, onPopupClose }) => {
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
                {spotOverview.mostLikedMedia && (
                    <div className="map-spot-overview-cover-container">
                        <div
                            className="map-spot-overview-cover"
                            style={{
                                backgroundImage: `url("${generateCloudinaryURL(
                                    spotOverview.mostLikedMedia.image.publicId,
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
