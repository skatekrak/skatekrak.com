import React from 'react';

import Typography from 'components/Ui/typography/Typography';
import * as S from './MapCreateSpotRain.styled';

type Props = {
    isRainSafe: boolean;
    handleRainChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
};

const MapCreateSpotRain = ({ isRainSafe, handleRainChange }: Props) => {
    return (
        <S.MapCreateSpotRainContainer>
            <Typography component="subtitle1">Rain safe?</Typography>
            <S.MapCreateSpotRainButtons>
                <S.MapCreateSpotRainCheckbox>
                    <input type="radio" name="rain" value="outdoor" checked={!isRainSafe} onChange={handleRainChange} />
                    <Typography>Outdoor</Typography>
                </S.MapCreateSpotRainCheckbox>
                <S.MapCreateSpotRainCheckbox>
                    <input type="radio" name="rain" value="indoor" checked={isRainSafe} onChange={handleRainChange} />
                    <Typography>Indoor</Typography>
                </S.MapCreateSpotRainCheckbox>
            </S.MapCreateSpotRainButtons>
        </S.MapCreateSpotRainContainer>
    );
};

export default MapCreateSpotRain;
