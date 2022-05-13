import React from 'react';

import Typography from 'components/Ui/typography/Typography';
import Emoji from 'components/Ui/Icons/Emoji';
import * as S from './MapZoomAlert.styled';

const MapZoomAlert = () => {
    return (
        <S.MapZoomAlertContainer>
            <S.MapZoomAlertMessageContainer>
                <S.MapZoomAlertMessageEmojiContainer>
                    <Emoji symbol="⚠️" label="warning" />
                    &emsp;
                    <Emoji symbol="📡" label="antenna" />
                </S.MapZoomAlertMessageEmojiContainer>
                <S.MapZoomAlertMessage component="body1">
                    “Ground control to major tom, come back to earth ...”
                </S.MapZoomAlertMessage>
            </S.MapZoomAlertMessageContainer>
            <S.MapZoomAlertActionContainer>
                <Typography component="subtitle2">Zoom in to display spots</Typography>
                <S.MapZoomAlertActionBackground />
            </S.MapZoomAlertActionContainer>
        </S.MapZoomAlertContainer>
    );
};

export default MapZoomAlert;
