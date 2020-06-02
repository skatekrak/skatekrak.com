import React from 'react';
import MapFilter from './MapFilter';

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
        console.log(name);
    };

    return (
        <div id="map-navigation-filters">
            <MapFilter name={FilterName.STREET} onFilterClick={onFilterClick} />
            <MapFilter name={FilterName.PARK} onFilterClick={onFilterClick} />
            <MapFilter name={FilterName.DIY} onFilterClick={onFilterClick} />
            <MapFilter name={FilterName.PRIVATE} onFilterClick={onFilterClick} />
            <MapFilter name={FilterName.SHOP} onFilterClick={onFilterClick} />
            <MapFilter name={FilterName.WIP} onFilterClick={onFilterClick} />
            <MapFilter name={FilterName.RIP} onFilterClick={onFilterClick} />
        </div>
    );
};

export default index;
