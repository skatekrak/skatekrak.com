import React from 'react';
import MapCustomNavigationItem from './MapCustomNavigationItem';
import axios from 'axios';
import { useQuery } from 'react-query';

export type CustomMap = {
    id: string;
    name: string;
    subtitle: string;
    about: string;
    edito: string;
    numberOfSpots: number;
};

const MapCustomNavigationTrail = () => {
    const { isLoading, error, data } = useQuery('custom-maps', () =>
        axios.get<CustomMap[]>('/api/custom-maps').then((res) => res.data),
    );

    return (
        <div id="custom-map-navigation-trail">
            {!isLoading && data.map((map) => <MapCustomNavigationItem map={map} key={map.id} />)}
        </div>
    );
};

export default React.memo(MapCustomNavigationTrail);
