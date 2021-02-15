import React from 'react';
import classNames from 'classnames';

import MapQuickAccessCityItem from './MapQuickAccessCityItem';
import ScrollBar from 'components/Ui/Scrollbar';

import cities from 'data/cities/_cities';

type MapQuickAccessCitiesProps = {
    isOpen: boolean;
};

const MapQuickAccessCities: React.FC<MapQuickAccessCitiesProps> = ({ isOpen }) => {
    return (
        <div id="map-quick-access-cities" className={classNames({ 'map-quick-access-cities--open': isOpen })}>
            <ScrollBar maxHeight="calc(100vh - 6rem - 2px)">
                <div id="map-quick-access-cities-grid">
                    {cities.map((city) => (
                        <MapQuickAccessCityItem key={city.id} city={city} />
                    ))}
                </div>
            </ScrollBar>
        </div>
    );
};

export default MapQuickAccessCities;
