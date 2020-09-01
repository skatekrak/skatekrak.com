import React, { useState } from 'react';
import classNames from 'classnames';
import NextLink from 'next/link';
const Link = React.memo(NextLink);

import IconArrow from 'components/Ui/Icons/Arrow';
import IconArrowHead from 'components/Ui/Icons/ArrowHead';

import MapCustomNavigationAbout from './MapCustomNavigationAbout';
import MapCustomNavigationSpots from './MapCustomNavigationSpots';

import { Spot } from 'lib/carrelageClient';

enum MapCustomNavigationMode {
    NONE = 'NONE',
    ABOUT = 'ABOUT',
    SPOTS = 'SPOTS',
}

type MapCustomNavigationProps = {
    title: string;
    about: string;
    subtitle: string;
    spots: Spot[];
};

const MapCustomNavigation = ({ title, about, subtitle, spots }: MapCustomNavigationProps) => {
    const [navigationMode, setNavigationMode] = useState<MapCustomNavigationMode>(MapCustomNavigationMode.NONE);

    const onCloseNavigationMode = () => {
        setNavigationMode(MapCustomNavigationMode.NONE);
    };

    return (
        <div id="custom-map-navigation">
            <Link href="/map">
                <a id="custom-map-navigation-close">
                    <IconArrow />
                    Back to Krak map
                </a>
            </Link>
            <div id="custom-map-navigation-main">
                <div id="custom-map-navigation-main-logo-container">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/fr/8/8e/Swoosh.svg"
                        id="custom-map-navigation-main-logo"
                    />
                </div>
                <div id="custom-map-navigation-main-container">
                    <h2 id="custom-map-navigation-main-title">{title}</h2>
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
                        {spots.length} spots
                        <IconArrowHead />
                    </button>
                </div>
            </div>
            {navigationMode !== MapCustomNavigationMode.NONE && (
                <div id="custom-map-navigation-extension">
                    {navigationMode === MapCustomNavigationMode.ABOUT && (
                        <MapCustomNavigationAbout
                            subtitle={subtitle}
                            about={about}
                            onCloseNavigationMode={onCloseNavigationMode}
                        />
                    )}
                    {navigationMode === MapCustomNavigationMode.SPOTS && <MapCustomNavigationSpots mapSpots={spots} />}
                </div>
            )}
        </div>
    );
};

export default React.memo(MapCustomNavigation);
