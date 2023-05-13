import React from 'react';

import Typography from 'components/Ui/typography/Typography';
import * as S from './MapCreateSpotLocation.styled';

type Props = {
    isMobile: boolean;
    handleToggleMapVisible: () => void;
    isPinPlaced?: boolean;
    isFlashing: boolean;
};

const MapCreateSpotLocationHelper = ({ isMobile, handleToggleMapVisible, isPinPlaced, isFlashing }: Props) => {
    return (
        <>
            <S.MapCreateSpotLocationHelperContainer isFlashing={isFlashing}>
                <Typography>Tap on the map to place the spot</Typography>
            </S.MapCreateSpotLocationHelperContainer>
            {isMobile && isPinPlaced && (
                <S.MapCreateSpotLocationSaveButton onClick={handleToggleMapVisible}>
                    Save location
                </S.MapCreateSpotLocationSaveButton>
            )}
        </>
    );
};

export default React.memo(MapCreateSpotLocationHelper);
