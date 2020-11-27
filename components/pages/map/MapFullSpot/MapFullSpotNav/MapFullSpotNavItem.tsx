import React from 'react';
import classNames from 'classnames';

import IconArrowHead from 'components/Ui/Icons/ArrowHead';

type MapFullSpotNavItemProps = {
    text: string;
    onClick?: () => void;
    isActive: boolean;
    icon?: React.ReactElement;
};

const MapFullSpotNavItem: React.FC<MapFullSpotNavItemProps> = ({ text, onClick, isActive, icon }) => {
    return (
        <button
            className={classNames('map-full-spot-popup-nav-link', {
                'map-full-spot-popup-nav-link--active': isActive,
            })}
            onClick={onClick}
        >
            {icon && <div className="map-full-spot-popup-nav-link-icon">{icon}</div>}
            <p className="map-full-spot-popup-nav-link-text">{text}</p>
            <IconArrowHead />
        </button>
    );
};

export default MapFullSpotNavItem;
