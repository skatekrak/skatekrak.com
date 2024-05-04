import React from 'react';

import Typography from '@/components/Ui/typography/Typography';
import IconPlus from '@/components/Ui/Icons/IconPlus';
import IconClips from '@/components/Ui/Icons/IconClips';
import IconMedia from '@/components/Ui/Icons/IconMedia';
import MapFullSpotAddTriggerTooltip from './MapFullSpotAddTriggerTooltip';
import * as S from './MapFullSpotAddTrigger.styled';

import { FullSpotTab } from '@/store/map/slice';
import useSession from '@/lib/hook/carrelage/use-session';
import { useRouter } from 'next/router';
import { useFullSpotSelectedTab } from '@/lib/hook/queryState';

const MapFullSpotAddTrigger = () => {
    const router = useRouter();
    const { data: sessionData } = useSession();
    const [, selectFullSpotTab] = useFullSpotSelectedTab();
    const isConnected = sessionData != null;

    const onTabSelect = (tab: FullSpotTab) => {
        selectFullSpotTab(tab);
    };

    const handleAddMediaClick = (close: () => void) => {
        if (isConnected) {
            onTabSelect('addMedia');
        } else {
            router.push('/auth/login');
        }
        close();
    };

    const handleAddClipClick = (close: () => void) => {
        if (isConnected) {
            onTabSelect('addClip');
        } else {
            router.push('/auth/login');
        }
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
