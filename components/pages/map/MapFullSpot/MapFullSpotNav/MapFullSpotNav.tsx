import React from 'react';
import { useSelector } from 'react-redux';

import Typings from 'Types';

import IconStreet from 'components/pages/map/marker/icons/Street';
import IconDiy from 'components/pages/map/marker/icons/Diy';
import IconPark from 'components/pages/map/marker/icons/Park';
import IconPrivate from 'components/pages/map/marker/icons/Private';
import IconRip from 'components/pages/map/marker/icons/Rip';
import IconShop from 'components/pages/map/marker/icons/Shop';
import IconWip from 'components/pages/map/marker/icons/Wip';

import IconArrowHead from 'components/Ui/Icons/ArrowHead';
import { Status, Types } from 'lib/carrelageClient';

const SpotIcon = ({ type, status}: { type: Types, status: Status}) => {
    if (status === Status.Rip) {
        return <IconRip />
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
}

const MapFullSpotNav = () => {
    const { spotOverview } = useSelector((state: Typings.RootState) => state.map);
    const { spot } = spotOverview;
    
    return (
        <div id="map-full-spot-popup-nav">
            <div id="map-full-spot-popup-nav-header">
                <div id="map-full-spot-popup-nav-header-city">
                    <p>
                        <span>{spot.location.city}</span> | {spot.location.country}
                    </p>
                </div>
                <h1 id="map-full-spot-popup-nav-header-name">{spot.name}</h1>
                <p id="map-full-spot-popup-nav-header-street">{spot.location.streetNumber} {spot.location.streetName}, {spot.location.city}</p>
                <div id="map-full-spot-popup-nav-header-extra">
                    <SpotIcon type={spot.type} status={spot.status} />
                    <div id="map-full-spot-popup-nav-header-extra-time">
                        <p id="map-full-spot-popup-nav-header-extra-time-title">
                            Local time<span> - GMT+4</span>
                        </p>
                        <p id="map-full-spot-popup-nav-header-extra-time-formated">08 : 56 pm</p>
                    </div>
                </div>
            </div>
            <nav id="map-full-spot-popup-nav-main">
                <button className="map-full-spot-popup-nav-link">
                    <p>Info</p>
                    <IconArrowHead />
                </button>
                <button className="map-full-spot-popup-nav-link">
                    <p>Edito</p>
                    <IconArrowHead />
                </button>
                <button className="map-full-spot-popup-nav-link">
                    <p>Tips(5)</p>
                    <IconArrowHead />
                </button>
                <button className="map-full-spot-popup-nav-link">
                    <p>Photos(23)</p>
                    <IconArrowHead />
                </button>
                <button className="map-full-spot-popup-nav-link">
                    <p>videos(45)</p>
                    <IconArrowHead />
                </button>
                <button className="map-full-spot-popup-nav-link">
                    <p>Clips(11)</p>
                    <IconArrowHead />
                </button>
                <button className="map-full-spot-popup-nav-link">
                    <p>Contests</p>
                    <IconArrowHead />
                </button>
                <button className="map-full-spot-popup-nav-link">
                    <p>Events</p>
                    <IconArrowHead />
                </button>
                <div id="map-full-spot-popup-nav-footer">
                    <button className="map-full-spot-popup-nav-link">
                        <p>Instagram</p>
                        <IconArrowHead />
                    </button>
                    <button className="map-full-spot-popup-nav-link">
                        <p>Contributors</p>
                        <IconArrowHead />
                    </button>
                </div>
            </nav>
        </div>
    );
};

export default MapFullSpotNav;
