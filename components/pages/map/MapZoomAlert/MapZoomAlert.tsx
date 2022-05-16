import React from 'react';

import Emoji from 'components/Ui/Icons/Emoji';
import * as S from './MapZoomAlert.styled';

const MapZoomAlert = () => {
    return (
        <S.MapZoomAlertContainer>
            <S.MapZoomAlertEmojiContainer>
                <Emoji symbol="⚠️" label="warning" />
                &emsp;
                <Emoji symbol="📡" label="antenna" />
            </S.MapZoomAlertEmojiContainer>
            <S.MapZoomAlertMessage component="body1">
                “Ground Control to Major Tom, come back to earth ...”
            </S.MapZoomAlertMessage>
            <S.MapZoomAlertAction component="body1">Zoom in to display spots</S.MapZoomAlertAction>
        </S.MapZoomAlertContainer>
    );
};

export default MapZoomAlert;
