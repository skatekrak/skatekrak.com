import React from 'react';

import MapFilters from './MapFilters';
import MapSearch from './MapSearch';

import * as S from './MapNavigation.styled';

const MapNavigation = () => {
    return (
        <S.MapNavigation>
            <MapSearch />
            <MapFilters />
        </S.MapNavigation>
    );
};

export default React.memo(MapNavigation);
