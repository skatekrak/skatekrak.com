import React from 'react';
import classNames from 'classnames';

import MapQuickAccessCityItem from './MapQuickAccessCityItem';
import ScrollBar from 'components/Ui/Scrollbar';

const fakeCities = [
    {
        name: 'Paris',
        photoUrl: 'https://loremflickr.com/320/240',
    },
    {
        name: 'London',
        photoUrl: 'https://loremflickr.com/320/240',
    },
    {
        name: 'NYC',
        photoUrl: 'https://loremflickr.com/320/240',
    },
    {
        name: 'Barcelone',
        photoUrl: 'https://loremflickr.com/320/240',
    },
    {
        name: 'L.A',
        photoUrl: 'https://loremflickr.com/320/240',
    },
    {
        name: 'S.F',
        photoUrl: 'https://loremflickr.com/320/240',
    },
    {
        name: 'Lyon',
        photoUrl: 'https://loremflickr.com/320/240',
    },
    {
        name: 'Paris',
        photoUrl: 'https://loremflickr.com/320/240',
    },
    {
        name: 'London',
        photoUrl: 'https://loremflickr.com/320/240',
    },
    {
        name: 'NYC',
        photoUrl: 'https://loremflickr.com/320/240',
    },
    {
        name: 'Barcelone',
        photoUrl: 'https://loremflickr.com/320/240',
    },
    {
        name: 'L.A',
        photoUrl: 'https://loremflickr.com/320/240',
    },
    {
        name: 'S.F',
        photoUrl: 'https://loremflickr.com/320/240',
    },
    {
        name: 'Lyon',
        photoUrl: 'https://loremflickr.com/320/240',
    },
    {
        name: 'Paris',
        photoUrl: 'https://loremflickr.com/320/240',
    },
    {
        name: 'London',
        photoUrl: 'https://loremflickr.com/320/240',
    },
    {
        name: 'NYC',
        photoUrl: 'https://loremflickr.com/320/240',
    },
    {
        name: 'Barcelone',
        photoUrl: 'https://loremflickr.com/320/240',
    },
    {
        name: 'L.A',
        photoUrl: 'https://loremflickr.com/320/240',
    },
    {
        name: 'S.F',
        photoUrl: 'https://loremflickr.com/320/240',
    },
    {
        name: 'Lyon',
        photoUrl: 'https://loremflickr.com/320/240',
    },
    {
        name: 'Paris',
        photoUrl: 'https://loremflickr.com/320/240',
    },
    {
        name: 'London',
        photoUrl: 'https://loremflickr.com/320/240',
    },
    {
        name: 'NYC',
        photoUrl: 'https://loremflickr.com/320/240',
    },
    {
        name: 'Barcelone',
        photoUrl: 'https://loremflickr.com/320/240',
    },
    {
        name: 'L.A',
        photoUrl: 'https://loremflickr.com/320/240',
    },
    {
        name: 'S.F',
        photoUrl: 'https://loremflickr.com/320/240',
    },
    {
        name: 'Lyon',
        photoUrl: 'https://loremflickr.com/320/240',
    },
    {
        name: 'Paris',
        photoUrl: 'https://loremflickr.com/320/240',
    },
    {
        name: 'LondonLondon LondonLondon',
        photoUrl: 'https://loremflickr.com/320/240',
    },
    {
        name: 'NYC',
        photoUrl: 'https://loremflickr.com/320/240',
    },
    {
        name: 'Barcelone',
        photoUrl: 'https://loremflickr.com/320/240',
    },
    {
        name: 'L.A',
        photoUrl: 'https://loremflickr.com/320/240',
    },
    {
        name: 'S.F',
        photoUrl: 'https://loremflickr.com/320/240',
    },
    {
        name: 'Lyon',
        photoUrl: 'https://loremflickr.com/320/240',
    },
];

type MapQuickAccessCitiesProps = {
    isOpen: boolean;
};

const MapQuickAccessCities: React.FC<MapQuickAccessCitiesProps> = ({ isOpen }) => {
    return (
        <div id="map-quick-access-cities" className={classNames({ 'map-quick-access-cities--open': isOpen })}>
            <ScrollBar maxHeight="calc(100vh - 6rem - 2px)">
                <div id="map-quick-access-cities-grid">
                    {fakeCities.map((city) => (
                        <MapQuickAccessCityItem key={city.name} city={city} />
                    ))}
                </div>
            </ScrollBar>
        </div>
    );
};

export default MapQuickAccessCities;
