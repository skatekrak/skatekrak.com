import React from 'react';
import { Field } from 'formik';

import Typography from 'components/Ui/typography/Typography';
import * as S from './MapCreateSpotRain.styled';

const MapCreateSpotRain = () => {
    return (
        <S.MapCreateSpotRainContainer>
            <Typography component="subtitle1">Rain safe?</Typography>
            <S.MapCreateSpotRainButtons>
                <S.MapCreateSpotRainCheckbox>
                    <Field type="radio" name="indoor" value="false" />
                    <Typography>Outdoor</Typography>
                </S.MapCreateSpotRainCheckbox>
                <S.MapCreateSpotRainCheckbox>
                    <Field type="radio" name="indoor" value="true" />
                    <Typography>Indoor</Typography>
                </S.MapCreateSpotRainCheckbox>
            </S.MapCreateSpotRainButtons>
        </S.MapCreateSpotRainContainer>
    );
};

export default MapCreateSpotRain;
