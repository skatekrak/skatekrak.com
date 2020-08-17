import React, { useState } from 'react';
import classNames from 'classnames';
import Link from 'next/link';

import IconArrow from 'components/Ui/Icons/Arrow';

import MapCustomNavigationAbout from './MapCustomNavigationAbout';
import MapCustomNavigationSpots from './MapCustomNavigationSpots';

import mapData from './mapData';
import IconArrowHead from 'components/Ui/Icons/ArrowHead';

enum MapCustomNavigationMode {
    NONE = 'NONE',
    ABOUT = 'ABOUT',
    SPOTS = 'SPOTS',
}

const index = () => {
    const [navigationMode, setNavigationMode] = useState<MapCustomNavigationMode>(MapCustomNavigationMode.NONE);

    const onCloseNavigationMode = () => {
        setNavigationMode(MapCustomNavigationMode.NONE);
    };

    return (
        <div id="custom-map-navigation">
            <div id="custom-map-navigation-container">
                <Link href="/map">
                    <a id="custom-map-navigation-close">
                        <IconArrow />
                        Back to Krak map
                    </a>
                </Link>
                <div id="custom-map-navigation-main">
                    <h2 id="custom-map-navigation-main-title">Nike teenage tour</h2>
                    <button
                        className="custom-map-navigation-link"
                        onClick={() => setNavigationMode(MapCustomNavigationMode.ABOUT)}
                    >
                        About
                    </button>
                    <button
                        className={classNames('custom-map-navigation-link', 'custom-map-navigation-link-spot', {
                            'custom-map-navigation-link-spot--open': navigationMode === MapCustomNavigationMode.SPOTS,
                        })}
                        onClick={() => {
                            if (navigationMode === MapCustomNavigationMode.NONE) {
                                setNavigationMode(MapCustomNavigationMode.SPOTS);
                            } else {
                                setNavigationMode(MapCustomNavigationMode.NONE);
                            }
                        }}
                    >
                        28 spots
                        <IconArrowHead />
                    </button>
                </div>
            </div>
            {navigationMode !== MapCustomNavigationMode.NONE && (
                <div id="custom-map-navigation-extension">
                    {navigationMode === MapCustomNavigationMode.ABOUT && (
                        <MapCustomNavigationAbout map={mapData} onCloseNavigationMode={onCloseNavigationMode} />
                    )}
                    {navigationMode === MapCustomNavigationMode.SPOTS && (
                        <MapCustomNavigationSpots mapSpots={mapData.spots} />
                    )}
                </div>
            )}
        </div>
    );
};

export default index;
