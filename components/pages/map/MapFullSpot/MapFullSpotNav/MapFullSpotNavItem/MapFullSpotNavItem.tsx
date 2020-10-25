import React from 'react';
import classNames from 'classnames';

import IconArrowHead from '../../../../../Ui/Icons/ArrowHead';

type MapFullSpotNavItemProps = {
    text: string;
    onClick?: () => void;
    isActive: boolean;
};

const MapFullSpotNavItem: React.FC<MapFullSpotNavItemProps> = ({ text, onClick, isActive }) => {
    return (
        <button
            className={classNames('map-full-spot-popup-nav-link', {
                'map-full-spot-popup-nav-link--active': isActive,
            })}
            onClick={onClick}
        >
            <p>{text}</p>
            <IconArrowHead />
        </button>
    );
};

export default MapFullSpotNavItem;
