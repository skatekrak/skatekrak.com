import React, { useState } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import Tippy from '@tippyjs/react/headless';

import MapQuickAccessCustom from './MapQuickAccessDesktopCustom';
import MapQuickAccessCitiesToggleButton from './MapQuickAccessDesktopCities/MapQuickAccessDesktopCitiesToggleButton';
import MapQuickAccessCities from './MapQuickAccessDesktopCities';

import * as S from './MapQuickAccessDesktop.styled';

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

const MapQuickAccessDesktop = () => {
    const [isCitiesOpen, setIsCitiesOpen] = useState(false);

    const onCitiesClick = (e: React.SyntheticEvent) => {
        e.preventDefault();
        setIsCitiesOpen(!isCitiesOpen);
    };

    const { isLoading, data } = useQuery(['custom-maps'], () =>
        axios.get<QuickAccessMap[]>('/api/custom-maps').then((res) => res.data),
    );

    return (
        <S.MapQuickAccessDesktopContainer>
            <S.MapQuickAccessDesktopSectionTitle component="subtitle2">Cities</S.MapQuickAccessDesktopSectionTitle>
            <div>
                <Tippy
                    visible={isCitiesOpen}
                    onClickOutside={() => setIsCitiesOpen(!isCitiesOpen)}
                    interactive
                    placement="left-start"
                    offset={[-36, 8]}
                    render={() => <MapQuickAccessCities isOpen={isCitiesOpen} onCitiesClick={onCitiesClick} />}
                >
                    <MapQuickAccessCitiesToggleButton isCitiesOpen={isCitiesOpen} onCitiesClick={onCitiesClick} />
                </Tippy>
            </div>
            <S.MapQuickAccessDesktopSectionDivider />
            <S.MapQuickAccessDesktopSectionTitle component="subtitle2">Maps</S.MapQuickAccessDesktopSectionTitle>
            <div style={{ position: 'relative' }}>
                <S.MapQuickAccessDesktopCustomContainer>
                    {!isLoading && data && data.map((map) => <MapQuickAccessCustom map={map} key={map.id} />)}
                </S.MapQuickAccessDesktopCustomContainer>
            </div>
        </S.MapQuickAccessDesktopContainer>
    );
};

export default React.memo(MapQuickAccessDesktop);
