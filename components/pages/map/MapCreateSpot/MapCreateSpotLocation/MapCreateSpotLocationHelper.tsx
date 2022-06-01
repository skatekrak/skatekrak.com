import React from 'react';

import Typography from 'components/Ui/typography/Typography';
import * as S from './MapCreateSpotLocation.styled';

type Props = {
    isFlashing: boolean;
};

const MapCreateSpotLocationHelper = ({ isFlashing }: Props) => {
    return (
        <S.MapCreateSpotLocationHelperContainer isFlashing={isFlashing}>
            <Typography>Tap on the map to place the spot</Typography>
        </S.MapCreateSpotLocationHelperContainer>
    );
};

export default React.memo(MapCreateSpotLocationHelper);
