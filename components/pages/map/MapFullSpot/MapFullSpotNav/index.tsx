import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import IconStreet from 'components/pages/map/marker/icons/Street';
import IconDiy from 'components/pages/map/marker/icons/Diy';
import IconPark from 'components/pages/map/marker/icons/Park';
import IconPrivate from 'components/pages/map/marker/icons/Private';
import IconRip from 'components/pages/map/marker/icons/Rip';
import IconShop from 'components/pages/map/marker/icons/Shop';
import IconWip from 'components/pages/map/marker/icons/Wip';

import { Spot, Status, Types } from 'lib/carrelageClient';
import { FullSpotTab } from 'store/map/reducers';
import { selectFullSpotTab } from 'store/map/actions';
import MapFullSpotNavItem from './MapFullSpotNavItem';
import { RootState } from 'store/reducers';

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
    const dispatch = useDispatch();
    const spotOverview = useSelector((state: RootState) => state.map.spotOverview);
    const selectedTab = useSelector((state: RootState) => state.map.fullSpotSelectedTab);

    const onTabSelect = (tab: FullSpotTab) => {
        dispatch(selectFullSpotTab(tab));
    };

    return (
        <div id="map-full-spot-popup-nav">
            {spotOverview != null && (
                <>
                    <div id="map-full-spot-popup-nav-header">
                        <div id="map-full-spot-popup-nav-header-city">
                            <p>
                                <span>{spotOverview.spot.location.city}</span> | {spotOverview.spot.location.country}
                            </p>
                        </div>
                        <h1 id="map-full-spot-popup-nav-header-name">{spotOverview.spot.name}</h1>
                        <p id="map-full-spot-popup-nav-header-street">{displayAddress(spotOverview.spot)}</p>
                        <div id="map-full-spot-popup-nav-header-extra">
                            <SpotIcon type={spotOverview.spot.type} status={spotOverview.spot.status} />
                        </div>
                    </div>
                    <nav id="map-full-spot-popup-nav-main">
                        <MapFullSpotNavItem
                            text={`Media${
                                spotOverview.spot.mediasStat.all > 0 ? ` (${spotOverview.spot.mediasStat.all})` : ''
                            }`}
                            onClick={() => onTabSelect('media')}
                            isActive={selectedTab === 'media'}
                        />
                        <MapFullSpotNavItem
                            text={`Clips${
                                spotOverview.spot.clipsStat.all > 0 ? ` (${spotOverview.spot.clipsStat.all})` : ''
                            }`}
                            onClick={() => onTabSelect('clips')}
                            isActive={selectedTab === 'clips'}
                        />
                    </nav>
                </>
            )}
        </div>
    );
};

export default MapFullSpotNav;
