import React from 'react';

import * as S from './MapFullSpotNav.styled';

type MapFullSpotNavItemProps = {
    text: string;
    onClick?: () => void;
    isActive: boolean;
    icon?: React.ReactElement;
};

const MapFullSpotNavItem: React.FC<MapFullSpotNavItemProps> = ({ text, onClick, isActive, icon }) => {
    return (
        <S.MapFullSpotNavItem isActive={isActive} onClick={onClick}>
            {icon && <S.MapFullSpotNavItemIcon>{icon}</S.MapFullSpotNavItemIcon>}
            <S.MapFullSpotNavItemText component="condensedSubtitle1">{text}</S.MapFullSpotNavItemText>
            <S.MapFullSpotNavItemArrow isActive={isActive} />
        </S.MapFullSpotNavItem>
    );
};

export default MapFullSpotNavItem;
