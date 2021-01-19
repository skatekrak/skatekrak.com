import React from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';

import MapQuickAccessItem from './MapQuickAccessItem';

export type CustomMap = {
    id: string;
    name: string;
    subtitle: string;
    about: string;
    edito: string;
    numberOfSpots: number;
};

const MapQuickAccess = () => {
    const { isLoading, error, data } = useQuery('custom-maps', () =>
        axios.get<CustomMap[]>('/api/custom-maps').then((res) => res.data),
    );

    return (
        <div id="map-quick-access">
            {!isLoading && data.map((map) => <MapQuickAccessItem map={map} key={map.id} />)}
        </div>
    );
};

export default React.memo(MapQuickAccess);
