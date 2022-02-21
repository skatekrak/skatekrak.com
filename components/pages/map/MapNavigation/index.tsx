import React from 'react';

import MapFilters from './MapFilters';
import MapSearch from './MapSearch';

const MapNavigation = () => {
    return (
        <div id="map-navigation">
            <div id="map-navigation-top-nav">
                <div id="map-navigation-top-nav-main">
                    <MapSearch />
                </div>
                <MapFilters />
            </div>
        </div>
    );
};

export default React.memo(MapNavigation);
