import React from 'react';

import ScrollBar from 'components/Ui/Scrollbar';
import MapQuickAccessCityItem from './MapQuickAccessCityItem';
import * as S from './MapQuickAccessCities.styled';

import cities from 'data/cities/_cities';

type MapQuickAccessCitiesProps = {
    isOpen: boolean;
    onCitiesClick: (e: React.SyntheticEvent) => void;
};

const MapQuickAccessCities: React.FC<MapQuickAccessCitiesProps> = ({ isOpen, onCitiesClick }) => {
    return (
        <S.MapQuickAccessCities isOpen={isOpen}>
            <ScrollBar maxHeight="calc(100vh - 10rem)">
                <S.MapQuickAccessCitiesGrid>
                    {cities.map((city) => (
                        <MapQuickAccessCityItem key={city.id} city={city} onCitiesClick={onCitiesClick} />
                    ))}
                </S.MapQuickAccessCitiesGrid>
            </ScrollBar>
        </S.MapQuickAccessCities>
    );
};

export default MapQuickAccessCities;
