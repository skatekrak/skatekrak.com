import React from 'react';
import { useSelector } from 'react-redux';

import Typings from 'Types';

import MapFullSpotEdito from './Edito';
import MapFullSpotInfo from './Info';
import MapFullSpotMainClips from './MapFullSpotMainClips';
import MapFullSpotTips from './Tips';

const MapFullSpotMain = () => {
    const selectedTab = useSelector((state: Typings.RootState) => state.map.fullSpotSelectedTab);
    const spotOverview = useSelector((state: Typings.RootState) => state.map.spotOverview);

    if (spotOverview) {
        return (
            <>
                {selectedTab === 'clips' && (
                    <MapFullSpotMainClips clips={spotOverview.clips} spot={spotOverview.spot} />
                )}
                {selectedTab === 'info' && <MapFullSpotInfo />}
                {selectedTab === 'tips' && <MapFullSpotTips />}
                {selectedTab === 'edito' && <MapFullSpotEdito />}
            </>
        );
    }

    return <div />;
};

export default MapFullSpotMain;
