import React from 'react';

import IconStreet from 'components/pages/map/marker/icons/Street';
import IconArrowHead from 'components/Ui/Icons/ArrowHead';

const MapFullSpotNav = () => {
    return (
        <div id="map-full-spot-popup-nav">
            <div id="map-full-spot-popup-nav-header">
                <div id="map-full-spot-popup-nav-header-city">
                    <p>
                        <span>Paris</span> | France
                    </p>
                </div>
                <h1 id="map-full-spot-popup-nav-header-name">Republique</h1>
                <p id="map-full-spot-popup-nav-header-street">Rue Notre Dame de Nazareth, Paris</p>
                <div id="map-full-spot-popup-nav-header-extra">
                    <IconStreet />
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
