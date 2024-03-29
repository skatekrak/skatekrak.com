import React from 'react';
import { useSelector } from 'react-redux';

import { RootState } from 'store';

import MapFullSpotEdito from './Edito';
import MapFullSpotInfo from './Info';
import MapFullSpotTips from './Tips';
import MapFullSpotMainClips from './MapFullSpotMainClips';
import MapFullSpotMedias from './MapFullSpotMedias';
import MapFullSpotAddMedia from './MapFullSpotAdd/MapFullSpotAddMedia';
import MapFullSpotAddClip from './MapFullSpotAdd/MapFullSpotAddClip';

const MapFullSpotMain = () => {
    const selectedTab = useSelector((state: RootState) => state.map.fullSpotSelectedTab);
    const spotOverview = useSelector((state: RootState) => state.map.spotOverview);

    if (spotOverview) {
        return (
            <>
                {selectedTab === 'clips' && (
                    <MapFullSpotMainClips clips={spotOverview.clips} spot={spotOverview.spot} />
                )}
                {selectedTab === 'addClip' && <MapFullSpotAddClip />}
                {selectedTab === 'media' && <MapFullSpotMedias medias={spotOverview.medias} spot={spotOverview.spot} />}
                {selectedTab === 'addMedia' && <MapFullSpotAddMedia />}
                {selectedTab === 'info' && <MapFullSpotInfo />}
                {selectedTab === 'tips' && <MapFullSpotTips />}
                {selectedTab === 'edito' && <MapFullSpotEdito />}
            </>
        );
    }

    return <div />;
};

export default MapFullSpotMain;
