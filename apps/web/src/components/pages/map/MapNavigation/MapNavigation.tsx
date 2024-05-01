import React from 'react';

import MapCreateSpotButton from '../MapCreateSpot/MapCreateSpotButton';
import MapSearch from './MapSearch';

import * as S from './MapNavigation.styled';

type Props = {
    handleCreateSpotClick: () => void;
};

const MapNavigation = ({ handleCreateSpotClick }: Props) => {
    return (
        <S.MapNavigation>
            <S.MapNavigationMain>
                <MapSearch />
                <MapCreateSpotButton onClick={handleCreateSpotClick} />
            </S.MapNavigationMain>
            {/* <MapFilters /> */}
        </S.MapNavigation>
    );
};

export default React.memo(MapNavigation);
