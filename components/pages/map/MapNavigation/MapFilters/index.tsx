import React from 'react';
import MapFilter from './MapFilter';

import DiyIcon from 'components/pages/map/marker/icons/Diy';
import ParkIcon from 'components/pages/map/marker/icons/Park';
import PrivateIcon from 'components/pages/map/marker/icons/Private';
import RipIcon from 'components/pages/map/marker/icons/Rip';
import ShopIcon from 'components/pages/map/marker/icons/Shop';
import StreetIcon from 'components/pages/map/marker/icons/Street';
import WipIcon from 'components/pages/map/marker/icons/Wip';

export enum FilterName {
    STREET = 'street',
    PARK = 'park',
    DIY = 'diy',
    PRIVATE = 'private',
    SHOP = 'shop',
    WIP = 'wip',
    RIP = 'rip',
}

const index = () => {
    const onFilterClick = (name: FilterName) => {
        // tslint:disable-next-line: no-console
        console.log(name);
    };

    return (
        <div id="map-navigation-filters">
            <MapFilter name={FilterName.STREET} icon={<StreetIcon />} onFilterClick={onFilterClick} />
            <MapFilter name={FilterName.PARK} icon={<ParkIcon />} onFilterClick={onFilterClick} />
            <MapFilter name={FilterName.DIY} icon={<DiyIcon />} onFilterClick={onFilterClick} />
            <MapFilter name={FilterName.PRIVATE} icon={<PrivateIcon />} onFilterClick={onFilterClick} />
            <MapFilter name={FilterName.SHOP} icon={<ShopIcon />} onFilterClick={onFilterClick} />
            <MapFilter name={FilterName.WIP} icon={<WipIcon />} onFilterClick={onFilterClick} />
            <MapFilter name={FilterName.RIP} icon={<RipIcon />} onFilterClick={onFilterClick} />
        </div>
    );
};

export default index;
