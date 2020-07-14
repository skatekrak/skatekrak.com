import Link from 'next/link';
import React from 'react';

import KrakLogoHand from 'components/Ui/branding/KrakLogoHand';
import MapFilters from './MapFilters';
import MapSearch from './MapSearch';
import DividerVertical from 'components/Ui/dividers/DividerVertical';

const index = () => {
    return (
        <div id="map-navigation">
            <div id="map-navigation-top-nav">
                <div id="map-navigation-top-nav-main">
                    <Link href="/">
                        <a id="map-navigation-link-home">
                            <KrakLogoHand />
                        </a>
                    </Link>
                    <DividerVertical />
                    <MapSearch />
                </div>
                <MapFilters />
            </div>
        </div>
    );
};

export default index;
