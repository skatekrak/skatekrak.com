import React from 'react';
import { useSelector } from 'react-redux';

import Typings from 'Types';

import MapFullSpotEdito from './Edito';
import MapFullSpotInfo from './Info';
import MapFullSpotMainClips from './MapFullSpotMainClips';
import MapFullSpotTips from './Tips';

const MapFullSpotMain = () => {
    const selectedTab = useSelector((state: Typings.RootState) => state.map.fullSpotSelectedTab);

    return (
        <div id="map-full-spot-popup-main">
            {selectedTab === 'clips' && <MapFullSpotMainClips />}
            {selectedTab === 'info' && <MapFullSpotInfo />}
            {selectedTab === 'tips' && <MapFullSpotTips />}
            {selectedTab === 'edito' && <MapFullSpotEdito />}
        </div>
    );
};

export default MapFullSpotMain;
