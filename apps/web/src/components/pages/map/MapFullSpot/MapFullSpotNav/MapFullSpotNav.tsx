import React from 'react';

import IconStreet from '@/components/pages/map/marker/icons/Street';
import IconDiy from '@/components/pages/map/marker/icons/Diy';
import IconPark from '@/components/pages/map/marker/icons/Park';
import IconPrivate from '@/components/pages/map/marker/icons/Private';
import IconRip from '@/components/pages/map/marker/icons/Rip';
import IconShop from '@/components/pages/map/marker/icons/Shop';
import IconWip from '@/components/pages/map/marker/icons/Wip';
import IconMedia from '@/components/Ui/Icons/IconMedia';
import IconClips from '@/components/Ui/Icons/IconClips';
import MapFullSpotNavItem from './MapFullSpotNavItem';
import MapFullSpotAddTrigger from '../MapFullSpotMain/MapFullSpotAdd/MapFullSpotAddTrigger';
import Typography from '@/components/Ui/typography/Typography';

import { Spot, Status, Types } from '@krak/carrelage-client';
import type { FullSpotTab } from '@/store/map';
import { useFullSpotSelectedTab } from '@/lib/hook/queryState';
import { useMapStore } from '@/store/map';

const SpotIcon = ({ type, status }: { type: Types; status: Status }) => {
    if (status === Status.Rip) {
        return <IconRip />;
    } else if (status === Status.Wip) {
        return <IconWip />;
    } else if (type === Types.Street) {
        return <IconStreet />;
    } else if (type === Types.Diy) {
        return <IconDiy />;
    } else if (type === Types.Park) {
        return <IconPark />;
    } else if (type === Types.Shop) {
        return <IconShop />;
    } else {
        return <IconPrivate />;
    }
};

/**
 *
 * @param spot Spot to display the address from
 */
const displayAddress = (spot: Spot): string => {
    const startOfAddress = [spot.location.streetNumber, spot.location.streetName]
        .filter((str) => str != null)
        .join(' ');

    if (startOfAddress) {
        return [startOfAddress, spot.location.city].join(', ');
    }

    return spot.location.city;
};

const MapFullSpotNav = () => {
    const spotOverview = useMapStore((state) => state.spotOverview);
    const [selectedTab, selectFullSpotTab] = useFullSpotSelectedTab();

    const onTabSelect = (tab: FullSpotTab) => {
        selectFullSpotTab(tab);
    };

    return (
        <div className="relative flex flex-col h-full py-8 px-0 overflow-y-auto tablet:pt-6 tablet:pb-8">
            {spotOverview != null && (
                <>
                    <div className="mx-6 mb-6 pb-6 border-b border-onDark-divider">
                        <Typography className="mb-4 max-w-[80%]" as="h1" component="heading5">
                            {spotOverview.spot.name}
                        </Typography>
                        <Typography className="mb-1 font-roboto uppercase [&_span]:font-roboto-bold" component="caption">
                            <span>{spotOverview.spot.location.city}</span> | {spotOverview.spot.location.country}
                        </Typography>
                        <Typography className="italic font-roboto text-onDark-mediumEmphasis" component="caption">
                            {displayAddress(spotOverview.spot)}
                        </Typography>
                        <div className="flex items-center mt-4 [&_.map-icon]:w-12 [&_.map-icon]:mr-6">
                            <SpotIcon type={spotOverview.spot.type} status={spotOverview.spot.status} />
                            <MapFullSpotAddTrigger />
                        </div>
                    </div>
                    <nav className="flex tablet:grow tablet:flex-col">
                        <MapFullSpotNavItem
                            text={`Media(${spotOverview.spot.mediasStat.all})`}
                            onClick={() => onTabSelect('media')}
                            isActive={selectedTab === 'media'}
                            icon={<IconMedia />}
                        />
                        <MapFullSpotNavItem
                            text={`Clips(${spotOverview.spot.clipsStat.all})`}
                            onClick={() => onTabSelect('clips')}
                            isActive={selectedTab === 'clips'}
                            icon={<IconClips />}
                        />
                    </nav>
                </>
            )}
        </div>
    );
};

export default MapFullSpotNav;
