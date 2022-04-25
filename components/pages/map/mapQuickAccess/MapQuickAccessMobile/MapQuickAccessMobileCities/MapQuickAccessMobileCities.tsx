import React from 'react';

import MapQuickAccessDesktopCityItem from '../../MapQuickAccessDesktop/MapQuickAccessDesktopCities/MapQuickAccessDesktopCityItem';
import * as S from './MapQuickAccessMobileCities.styled';

import cities from 'data/cities/_cities';

type Props = {
    closeSheet: () => void;
};

const MapQuickAccessMobileCities: React.FC<Props> = ({ closeSheet }) => {
    return (
        <S.MapQuickAccessMobileCitiesGrid>
            {cities.map((city) => (
                <MapQuickAccessDesktopCityItem key={city.id} city={city} onCitiesClick={closeSheet} />
            ))}
        </S.MapQuickAccessMobileCitiesGrid>
    );
};

export default MapQuickAccessMobileCities;
