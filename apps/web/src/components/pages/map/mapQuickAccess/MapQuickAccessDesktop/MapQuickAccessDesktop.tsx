import React from 'react';

import Cities from './Cities';
import CustomMapsSide from './Maps/Maps';
import * as S from './MapQuickAccessDesktop.styled';

const MapQuickAccessDesktop = () => {
    return (
        <S.MapQuickAccessDesktopContainer>
            <Cities />
            <CustomMapsSide />
        </S.MapQuickAccessDesktopContainer>
    );
};

export default React.memo(MapQuickAccessDesktop);
