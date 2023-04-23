import React from 'react';

import Cities from './Cities';
import Maps from './Maps/Maps';
import * as S from './MapQuickAccessDesktop.styled';

const MapQuickAccessDesktop = () => {
    return (
        <S.MapQuickAccessDesktopContainer>
            <Cities />
            <Maps />
        </S.MapQuickAccessDesktopContainer>
    );
};

export default React.memo(MapQuickAccessDesktop);
