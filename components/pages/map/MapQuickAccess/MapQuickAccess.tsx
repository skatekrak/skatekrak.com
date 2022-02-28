import React, { useState } from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import Tippy from '@tippyjs/react/headless';

import MapQuickAccessCustom from './MapQuickAccessCustom';
import MapQuickAccessCitiesToggleButton from './MapQuickAccessCities/MapQuickAccessCitiesToggleButton';
import MapQuickAccessCities from './MapQuickAccessCities';

import * as S from './MapQuickAccess.styled';

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

    const { isLoading, data } = useQuery('custom-maps', () =>
        axios.get<QuickAccessMap[]>('/api/custom-maps').then((res) => res.data),
    );

    return (
        <S.MapQuickAccesscontainer>
            <S.MapQuickAccessSectionTitle component="subtitle2">Cities</S.MapQuickAccessSectionTitle>
            <div>
                <Tippy
                    visible={isCitiesOpen}
                    onClickOutside={() => setIsCitiesOpen(!isCitiesOpen)}
                    interactive
                    placement="left-start"
                    offset={[-36, 24]}
                    render={() => <MapQuickAccessCities isOpen={isCitiesOpen} onCitiesClick={onCitiesClick} />}
                >
                    <MapQuickAccessCitiesToggleButton isCitiesOpen={isCitiesOpen} onCitiesClick={onCitiesClick} />
                </Tippy>
            </div>
            <S.MapQuickAccessSectionDivider />
            <S.MapQuickAccessSectionTitle component="subtitle2">Maps</S.MapQuickAccessSectionTitle>
            <div style={{ position: 'relative' }}>
                <S.MapQuickAccessCustomContainer>
                    {!isLoading && data && data.map((map) => <MapQuickAccessCustom map={map} key={map.id} />)}
                </S.MapQuickAccessCustomContainer>
            </div>
        </S.MapQuickAccesscontainer>
    );
};

export default React.memo(MapQuickAccess);
