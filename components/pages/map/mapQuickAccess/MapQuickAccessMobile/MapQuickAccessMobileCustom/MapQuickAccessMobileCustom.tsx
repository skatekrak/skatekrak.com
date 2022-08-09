import React from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import MapQuickAccessMobileCustomItem from './MapQuickAccessMobileCustomItem';
import * as S from './MapQuickAccessMobileCustom.styled';

import { QuickAccessMap } from '../../MapQuickAccessDesktop/MapQuickAccessDesktop';

type Props = {
    closeSheet: () => void;
};

const MapQuickAccessMobileCustom: React.FC<Props> = ({ closeSheet }) => {
    const { isLoading, data } = useQuery(['custom-maps'], () =>
        axios.get<QuickAccessMap[]>('/api/custom-maps').then((res) => res.data),
    );

    return (
        <S.MapQuickAccessMobileCustomContainer>
            {!isLoading &&
                data &&
                data.map((map) => <MapQuickAccessMobileCustomItem key={map.id} map={map} closeSheet={closeSheet} />)}
        </S.MapQuickAccessMobileCustomContainer>
    );
};

export default MapQuickAccessMobileCustom;
