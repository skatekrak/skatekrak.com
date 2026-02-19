import React from 'react';

import Typography from '@/components/Ui/typography/Typography';
import IconPlus from '@/components/Ui/Icons/IconPlus';
import IconClips from '@/components/Ui/Icons/IconClips';
import IconMedia from '@/components/Ui/Icons/IconMedia';
import MapFullSpotAddTriggerTooltip from './MapFullSpotAddTriggerTooltip';

import { FullSpotTab } from '@/store/map';
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
                    <button
                        className="flex items-center w-full py-2 px-4 text-left text-onDark-highEmphasis border-b border-onDark-divider hover:bg-tertiary-medium last-of-type:border-b-0 [&_.krak-icon]:w-5 [&_.krak-icon]:mr-2 [&_.krak-icon]:fill-onDark-highEmphasis"
                        onClick={() => handleAddMediaClick(close)}
                    >
                        <IconMedia />
                        <Typography component="button">Add media</Typography>
                    </button>
                    <button
                        className="flex items-center w-full py-2 px-4 text-left text-onDark-highEmphasis border-b border-onDark-divider hover:bg-tertiary-medium last-of-type:border-b-0 [&_.krak-icon]:w-5 [&_.krak-icon]:mr-2 [&_.krak-icon]:fill-onDark-highEmphasis"
                        onClick={() => handleAddClipClick(close)}
                    >
                        <IconClips />
                        <Typography component="button">Add clip</Typography>
                    </button>
                </>
            )}
        >
            <button className="flex items-center justify-center ml-auto p-1 border border-primary-100 rounded [&_.icon-plus]:w-6 [&_.icon-plus]:fill-primary-100 hover:[&_.icon-plus]:fill-primary-80">
                <IconPlus />
            </button>
        </MapFullSpotAddTriggerTooltip>
    );
};

export default MapFullSpotAddTrigger;
