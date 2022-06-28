import React from 'react';
import { useDispatch } from 'react-redux';

import Typography from 'components/Ui/typography/Typography';
import IconPlus from 'components/Ui/Icons/IconPlus';
import IconClips from 'components/Ui/Icons/IconClips';
import IconMedia from 'components/Ui/Icons/IconMedia';
import MapFullSpotAddTriggerTooltip from './MapFullSpotAddTriggerTooltip';
import * as S from './MapFullSpotAddTrigger.styled';

import { FullSpotTab, selectFullSpotTab } from 'store/map/slice';

const MapFullSpotAddTrigger = () => {
    const dispatch = useDispatch();

    const onTabSelect = (tab: FullSpotTab) => {
        dispatch(selectFullSpotTab(tab));
    };

    const handleAddMediaClick = (close: () => void) => {
        onTabSelect('addMedia');
        close();
    };

    const handleAddClipClick = (close: () => void) => {
        onTabSelect('addClip');
        close();
    };

    return (
        <MapFullSpotAddTriggerTooltip
            render={({ close }) => (
                <>
                    <S.MapFullSpotAddTriggerTooltipButton onClick={() => handleAddMediaClick(close)}>
                        <IconMedia />
                        <Typography component="button">Add media</Typography>
                    </S.MapFullSpotAddTriggerTooltipButton>
                    <S.MapFullSpotAddTriggerTooltipButton onClick={() => handleAddClipClick(close)}>
                        <IconClips />
                        <Typography component="button">Add clip</Typography>
                    </S.MapFullSpotAddTriggerTooltipButton>
                </>
            )}
        >
            <S.MapFullSpotAddTriggerButton>
                <IconPlus />
            </S.MapFullSpotAddTriggerButton>
        </MapFullSpotAddTriggerTooltip>
    );
};

export default MapFullSpotAddTrigger;
