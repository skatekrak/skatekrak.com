import React from 'react';

import MapQuickAccessMobileCustomItem from './MapQuickAccessMobileCustomItem';
import * as S from './MapQuickAccessMobileCustom.styled';

import { useCustomMaps } from 'lib/hook/use-custom-map';

type Props = {
    closeSheet: () => void;
};

const MapQuickAccessMobileCustom: React.FC<Props> = ({ closeSheet }) => {
    const { isLoading, data } = useCustomMaps();

    return (
        <S.MapQuickAccessMobileCustomContainer>
            {!isLoading &&
                data &&
                data.map((map) => <MapQuickAccessMobileCustomItem key={map.id} map={map} closeSheet={closeSheet} />)}
        </S.MapQuickAccessMobileCustomContainer>
    );
};

export default MapQuickAccessMobileCustom;
