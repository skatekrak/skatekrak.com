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
import * as S from './MapFullSpotNav.styled';

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
        <S.MapFullSpotNavContainer>
            {spotOverview != null && (
                <>
                    <S.MapFullSpotNavHeader>
                        <S.MapFullSpotName forwardedAs="h1" component="heading5">
                            {spotOverview.spot.name}
                        </S.MapFullSpotName>
                        <S.MapFullSpotCity component="caption">
                            <span>{spotOverview.spot.location.city}</span> | {spotOverview.spot.location.country}
                        </S.MapFullSpotCity>
                        <S.MapFullSpotStreet component="caption">
                            {displayAddress(spotOverview.spot)}
                        </S.MapFullSpotStreet>
                        <S.MapFullSpotExtra>
                            <SpotIcon type={spotOverview.spot.type} status={spotOverview.spot.status} />
                            <MapFullSpotAddTrigger />
                        </S.MapFullSpotExtra>
                    </S.MapFullSpotNavHeader>
                    <S.MapFullSpotNavMain>
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
                    </S.MapFullSpotNavMain>
                </>
            )}
        </S.MapFullSpotNavContainer>
    );
};

export default MapFullSpotNav;
