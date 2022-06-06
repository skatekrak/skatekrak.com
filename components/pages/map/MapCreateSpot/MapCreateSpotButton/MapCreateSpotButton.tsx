import React from 'react';

import IconPlus from 'components/Ui/Icons/IconPlus';
import * as S from './MapCreateSpotButton.styled';

type Props = {
    onClick: () => void;
};

const MapCreateSpotButton: React.FC<Props> = ({ onClick }) => {
    return (
        <S.MapCreateSpotButton onClick={onClick}>
            <IconPlus />
        </S.MapCreateSpotButton>
    );
};

export default MapCreateSpotButton;
