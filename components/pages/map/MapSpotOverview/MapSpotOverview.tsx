import React from 'react';
import classNames from 'classnames';
import { Popup } from 'react-map-gl';

import { SpotOverview } from 'lib/carrelageClient';

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
            className="map-popup-spot"
            longitude={spotOverview.spot.location.longitude}
            latitude={spotOverview.spot.location.latitude}
            onClose={onPopupClose}
            tipSize={8}
            closeButton={false}
            closeOnClick={false}
        >
            <button className="map-popup-spot-container" onClick={onPopupClick}>
                <h4
                    className={classNames('map-popup-spot-name', {
                        'map-popup-spot-name-center': !spotOverview.mostLikedMedia,
                    })}
                >
                    {spotOverview.spot.name}
                </h4>
                {spotOverview.mostLikedMedia && (
                    <div className="map-popup-spot-cover-container">
                        <div
                            className="map-popup-spot-cover"
                            style={{
                                backgroundImage: `url("${generateCloudinaryURL(
                                    spotOverview.mostLikedMedia.image.publicId,
                                )}")`,
                            }}
                        />
                    </div>
                )}
            </button>
        </Popup>
    );
};

export default MapSpotOverview;
