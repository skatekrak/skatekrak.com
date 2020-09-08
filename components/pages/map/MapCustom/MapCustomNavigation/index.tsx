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
    id: string;
    title: string;
    about: string;
    subtitle: string;
    spots: Spot[];
};

const MapCustomNavigation = ({ id, title, about, subtitle, spots }: MapCustomNavigationProps) => {
    const [navigationMode, setNavigationMode] = useState<MapCustomNavigationMode>(MapCustomNavigationMode.NONE);

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
                        src={`/images/map/custom-maps/${id}.png`}
                        srcSet={`
                            /images/map/custom-maps/${id}.png 1x,
                            /images/map/custom-maps/${id}-@2x.png 2x,
                            /images/map/custom-maps/${id}-@3x.png 3x
                        `}
                        id="custom-map-navigation-main-logo"
                    />
                </div>
                <div id="custom-map-navigation-main-container">
                    <h2 id="custom-map-navigation-main-title">{title}</h2>
                    <button
                        className={classNames('custom-map-navigation-link', {
                            'custom-map-navigation-link--open': navigationMode === MapCustomNavigationMode.ABOUT,
                        })}
                        onClick={() => {
                            if (navigationMode === MapCustomNavigationMode.ABOUT) {
                                setNavigationMode(MapCustomNavigationMode.NONE);
                            } else {
                                setNavigationMode(MapCustomNavigationMode.ABOUT);
                            }
                        }}
                    >
                        About
                        <IconArrowHead />
                    </button>
                    <button
                        className={classNames('custom-map-navigation-link', {
                            'custom-map-navigation-link--open': navigationMode === MapCustomNavigationMode.SPOTS,
                        })}
                        onClick={() => {
                            if (navigationMode === MapCustomNavigationMode.SPOTS) {
                                setNavigationMode(MapCustomNavigationMode.NONE);
                            } else {
                                setNavigationMode(MapCustomNavigationMode.SPOTS);
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
                        <MapCustomNavigationAbout subtitle={subtitle} about={about} />
                    )}
                    {navigationMode === MapCustomNavigationMode.SPOTS && <MapCustomNavigationSpots mapSpots={spots} />}
                </div>
            )}
        </div>
    );
};

export default React.memo(MapCustomNavigation);
