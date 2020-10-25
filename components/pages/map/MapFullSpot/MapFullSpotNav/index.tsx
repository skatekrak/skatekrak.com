import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Typings from 'Types';

import IconStreet from 'components/pages/map/marker/icons/Street';
import IconDiy from 'components/pages/map/marker/icons/Diy';
import IconPark from 'components/pages/map/marker/icons/Park';
import IconPrivate from 'components/pages/map/marker/icons/Private';
import IconRip from 'components/pages/map/marker/icons/Rip';
import IconShop from 'components/pages/map/marker/icons/Shop';
import IconWip from 'components/pages/map/marker/icons/Wip';

import { Status, Types } from 'lib/carrelageClient';
import { FullSpotTab } from 'store/map/reducers';
import { selectFullSpotTab } from 'store/map/actions';
import MapFullSpotNavItem from './MapFullSpotNavItem/MapFullSpotNavItem';

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

const MapFullSpotNav = () => {
    const dispatch = useDispatch();
    const spotOverview = useSelector((state: Typings.RootState) => state.map.spotOverview);
    const selectedTab = useSelector((state: Typings.RootState) => state.map.fullSpotSelectedTab);

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
                        <p id="map-full-spot-popup-nav-header-street">
                            {spotOverview.spot.location.streetNumber} {spotOverview.spot.location.streetName},{' '}
                            {spotOverview.spot.location.city}
                        </p>
                        <div id="map-full-spot-popup-nav-header-extra">
                            <SpotIcon type={spotOverview.spot.type} status={spotOverview.spot.status} />
                            <div id="map-full-spot-popup-nav-header-extra-time">
                                <p id="map-full-spot-popup-nav-header-extra-time-title">
                                    Local time<span> - GMT+4</span>
                                </p>
                                <p id="map-full-spot-popup-nav-header-extra-time-formated">08 : 56 pm</p>
                            </div>
                        </div>
                    </div>
                    <nav id="map-full-spot-popup-nav-main">
                        {/* <MapFullSpotNavItem
                            text="Info"
                            onClick={() => onTabSelect('info')}
                            isActive={selectedTab === 'info'}
                        />
                        <MapFullSpotNavItem
                            text="Edito"
                            onClick={() => onTabSelect('edito')}
                            isActive={selectedTab === 'edito'}
                        />
                        <MapFullSpotNavItem
                            text="Tips(x)"
                            onClick={() => onTabSelect('tips')}
                            isActive={selectedTab === 'tips'}
                        />
                        <MapFullSpotNavItem
                            text="Photos(x)"
                            onClick={() => onTabSelect('photos')}
                            isActive={selectedTab === 'photos'}
                        />
                        <MapFullSpotNavItem
                            text="Videos(x)"
                            onClick={() => onTabSelect('videos')}
                            isActive={selectedTab === 'videos'}
                        /> */}
                        <MapFullSpotNavItem
                            text="Clips(x)"
                            onClick={() => onTabSelect('clips')}
                            isActive={selectedTab === 'clips'}
                        />
                        {/* <MapFullSpotNavItem
                            text="Contests"
                            onClick={() => onTabSelect('contests')}
                            isActive={selectedTab === 'contests'}
                        />
                        <MapFullSpotNavItem
                            text="Events"
                            onClick={() => onTabSelect('events')}
                            isActive={selectedTab === 'events'}
                        />
                        <div id="map-full-spot-popup-nav-footer">
                            <MapFullSpotNavItem
                                text="Instagram"
                                onClick={() => onTabSelect('instagram')}
                                isActive={selectedTab === 'instagram'}
                            />
                            <MapFullSpotNavItem
                                text="Contributors"
                                onClick={() => onTabSelect('contributors')}
                                isActive={selectedTab === 'contributors'}
                            />
                        </div> */}
                    </nav>
                </>
            )}
        </div>
    );
};

export default MapFullSpotNav;
