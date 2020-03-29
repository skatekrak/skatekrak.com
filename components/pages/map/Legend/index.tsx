import React, { useState } from 'react';

import CloseButton from 'components/Ui/Button/CloseButton';
import Scrollbar from 'components/Ui/Scrollbar';

import IconDiy from 'components/pages/map/marker/icons/Diy';
import IconPark from 'components/pages/map/marker/icons/Park';
import IconPrivate from 'components/pages/map/marker/icons/Private';
import IconRip from 'components/pages/map/marker/icons/Rip';
import IconShop from 'components/pages/map/marker/icons/Shop';
import IconStreet from 'components/pages/map/marker/icons/Street';
import IconWip from 'components/pages/map/marker/icons/Wip';

import Activity from 'components/pages/map/marker/Activity';
import BadgeHistory from 'components/pages/map/marker/badges/History';
import BadgeIconic from 'components/pages/map/marker/badges/Iconic';
import KrakAppIcon from 'components/Ui/Icons/Logos/KrakAppIcon';

const index = () => {
    const [isLegendOpen, setLegendOpen] = useState(false);

    const handleLegendOpen = () => {
        setLegendOpen(!isLegendOpen);
    };

    return (
        <>
            {!isLegendOpen ? (
                <button id="map-legend-trigger" onClick={handleLegendOpen}>
                    <KrakAppIcon />
                    Legend
                </button>
            ) : (
                <div id="map-legend">
                    <CloseButton onClick={handleLegendOpen} />
                    <h3 id="map-legend-title">Explore the map</h3>
                    <Scrollbar maxHeight="60vh">
                        <div id="map-legend-scroll-container">
                            <p id="map-legend-desc">
                                Skateboarding isn't easy. It takes time, passion, effort & learning. But when you're in
                                the flow, starting to see things all around you differently, it's incredibly thrilling &
                                addictive. That's why we're making this map. There's so much more to come. If you want
                                to be a part of it, please join us.
                            </p>
                            <h4 className="map-legend-title">Categories & status</h4>
                            <ul className="map-legend-section-container">
                                <li className="map-legend-category">
                                    <IconStreet />
                                    Street
                                </li>
                                <li className="map-legend-category">
                                    <IconPark />
                                    Park
                                </li>
                                <li className="map-legend-category">
                                    <IconShop />
                                    Shop
                                </li>
                                <li className="map-legend-category">
                                    <IconPrivate />
                                    Private
                                </li>
                                <li className="map-legend-category">
                                    <IconDiy />
                                    DIY [do it yourself]
                                </li>
                                <li className="map-legend-category">
                                    <IconWip />
                                    WIP [work in progress]
                                </li>
                                <li className="map-legend-category">
                                    <IconRip />
                                    RIP [rest in peace]
                                </li>
                            </ul>
                            <div className="map-legend-divider" />
                            <h4 className="map-legend-title">Tags</h4>
                            <ul className="map-legend-section-container">
                                <li className="map-legend-tags">
                                    <BadgeIconic />
                                    Famous
                                </li>
                                <li className="map-legend-tags">
                                    <BadgeHistory />
                                    History Clip
                                </li>
                                <li className="map-legend-tags">Minute</li>
                            </ul>
                            <div className="map-legend-divider" />
                            <h4 className="map-legend-title">Activity [amount of media uploaded]</h4>
                            <ul className="map-legend-section-container map-legend-activity-container">
                                <li className="map-legend-activity">
                                    <div className="map-marker-icon">
                                        <IconStreet />
                                        <div className="map-marker-badges">
                                            <BadgeIconic />
                                        </div>
                                    </div>
                                    {'< 3'}
                                </li>
                                <li className="map-legend-activity">
                                    <div className="map-marker-icon">
                                        <IconStreet />
                                        <div className="map-marker-badges">
                                            <BadgeIconic />
                                        </div>
                                        <Activity firing />
                                    </div>
                                    {'< 10'}
                                </li>
                                <li className="map-legend-activity">
                                    <div className="map-marker-icon">
                                        <IconStreet />
                                        <div className="map-marker-badges">
                                            <BadgeIconic />
                                        </div>
                                        <Activity firing />
                                    </div>
                                    {'> 10'}
                                </li>
                            </ul>
                            <div className="map-legend-divider" />
                            <h4 className="map-legend-title">Obstacles</h4>
                            <p className="map-legend-coming-soon">Coming soon</p>
                        </div>
                    </Scrollbar>
                </div>
            )}
        </>
    );
};

export default index;
