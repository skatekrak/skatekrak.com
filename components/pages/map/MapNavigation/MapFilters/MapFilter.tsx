import classNames from 'classnames';
import React, { useState } from 'react';

import DiyIcon from '../../marker/icons/Diy';
import ParkIcon from '../../marker/icons/Park';
import PrivateIcon from '../../marker/icons/Private';
import RipIcon from '../../marker/icons/Rip';
import ShopIcon from '../../marker/icons/Shop';
import StreetIcon from '../../marker/icons/Street';
import WipIcon from '../../marker/icons/Wip';

import { FilterName } from './index';

type Props = {
    name: FilterName;
    onFilterClick: (name: FilterName) => void;
};

const MapFilter: React.FC<Props> = ({ name, onFilterClick }) => {
    const [isActive, setIsActive] = useState(true);

    const handleOnClick = () => {
        setIsActive(!isActive);
        onFilterClick(name);
    };

    return (
        <button
            className={classNames(`map-navigation-filter map-navigation-filter-${name}`, {
                'map-navigation-filter-inactive': !isActive,
            })}
            onClick={handleOnClick}
        >
            {name === FilterName.STREET && <StreetIcon />}
            {name === FilterName.PARK && <ParkIcon />}
            {name === FilterName.DIY && <DiyIcon />}
            {name === FilterName.PRIVATE && <PrivateIcon />}
            {name === FilterName.SHOP && <ShopIcon />}
            {name === FilterName.WIP && <WipIcon />}
            {name === FilterName.RIP && <RipIcon />}
        </button>
    );
};

export default MapFilter;
