import React from 'react';

import Cities from './Cities';
import Maps from './Maps/Maps';
import * as S from './MapQuickAccessDesktop.styled';

const MapQuickAccessDesktop = () => {
    return (
        <S.MapQuickAccessDesktopContainer>
            {/* <S.MapQuickAccessDesktopSectionTitle component="subtitle2">Cities</S.MapQuickAccessDesktopSectionTitle> */}
            <Cities />
            {/* <S.MapQuickAccessDesktopSectionDivider /> */}
            {/* <S.MapQuickAccessDesktopSectionTitle component="subtitle2">Maps</S.MapQuickAccessDesktopSectionTitle> */}
            <Maps />
        </S.MapQuickAccessDesktopContainer>
    );
};

export default React.memo(MapQuickAccessDesktop);
