import React from 'react';

import City from '../../MapQuickAccessDesktop/Cities/City';
import * as S from './MapQuickAccessMobileCities.styled';

import cities from '@/data/cities/_cities';

type Props = {
    closeSheet: () => void;
};

const MapQuickAccessMobileCities: React.FC<Props> = ({ closeSheet }) => {
    return (
        <S.MapQuickAccessMobileCitiesGrid>
            {cities.map((city) => (
                <City key={city.id} city={city} onCityClick={closeSheet} />
            ))}
        </S.MapQuickAccessMobileCitiesGrid>
    );
};

export default MapQuickAccessMobileCities;
