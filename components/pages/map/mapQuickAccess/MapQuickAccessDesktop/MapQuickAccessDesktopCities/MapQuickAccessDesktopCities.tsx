import React from 'react';

import ScrollBar from 'components/Ui/Scrollbar';
import MapQuickAccessDesktopCityItem from './MapQuickAccessDesktopCityItem';
import * as S from './MapQuickAccessDesktopCities.styled';

import cities from 'data/cities/_cities';

type MapQuickAccessDesktopCitiesProps = {
    isOpen: boolean;
    onCitiesClick: (e: React.SyntheticEvent) => void;
};

const MapQuickAccessDesktopCities: React.FC<MapQuickAccessDesktopCitiesProps> = ({ isOpen, onCitiesClick }) => {
    return (
        <S.MapQuickAccessDesktopCities isOpen={isOpen}>
            <ScrollBar maxHeight="calc(100vh - 10rem)">
                <S.MapQuickAccessDesktopCitiesGrid>
                    {cities.map((city) => (
                        <MapQuickAccessDesktopCityItem key={city.id} city={city} onCitiesClick={onCitiesClick} />
                    ))}
                </S.MapQuickAccessDesktopCitiesGrid>
            </ScrollBar>
        </S.MapQuickAccessDesktopCities>
    );
};

export default MapQuickAccessDesktopCities;
