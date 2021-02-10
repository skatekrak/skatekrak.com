import React, { useState } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';

import MapQuickAccessMap from './MapQuickAccessMap';
import MapQuickAccessCity from './MapQuickAccessCity';
import MapQuickAccessCities from './MapQuickAccessCities';

import spots from '../../../../data/_spots';

export interface QuickAccess {
    id: string;
    name: string;
    edito: string;
}

export interface QuickAccessMap extends QuickAccess {
    subtitle: string;
    about: string;
    numberOfSpots?: number;
}

const MapQuickAccess = () => {
    const [isCitiesOpen, setIsCitiesOpen] = useState(false);

    const onCitiesClick = (e: React.SyntheticEvent) => {
        e.preventDefault();
        setIsCitiesOpen(!isCitiesOpen);
    };

    const { isLoading, error, data } = useQuery('custom-maps', () =>
        axios.get<QuickAccessMap[]>('/api/custom-maps').then((res) => res.data),
    );

    return (
        <div id="map-quick-access">
            <p className="map-quick-access-section-title">Cities</p>
            <MapQuickAccessCity isCitiesOpen={isCitiesOpen} onCitiesClick={onCitiesClick} />
            <MapQuickAccessCities isOpen={isCitiesOpen} />
            <div className="map-quick-access-divider" />
            <p className="map-quick-access-section-title">Maps</p>
            {/* {!isLoading && data && data.map((map) => <MapQuickAccessMap map={map} key={map.id} />)} */}
            {spots.map((map) => (
                <MapQuickAccessMap map={map} key={map.id} />
            ))}
        </div>
    );
};

export default React.memo(MapQuickAccess);
