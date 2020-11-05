import React from 'react';
import { useSelector } from 'react-redux';

import { RootState } from 'store/reducers';

import MapFullSpotEdito from './Edito';
import MapFullSpotInfo from './Info';
import MapFullSpotTips from './Tips';
import MapFullSpotMainClips from './MapFullSpotMainClips';
import MapFullSpotMedias from './MapFullSpotMedias';

const MapFullSpotMain = () => {
    const selectedTab = useSelector((state: RootState) => state.map.fullSpotSelectedTab);
    const spotOverview = useSelector((state: RootState) => state.map.spotOverview);

    if (spotOverview) {
        return (
            <>
                {selectedTab === 'clips' && (
                    <MapFullSpotMainClips clips={spotOverview.clips} spot={spotOverview.spot} />
                )}
                {selectedTab === 'photos' && (
                    <MapFullSpotMedias medias={spotOverview.medias} spot={spotOverview.spot} />
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
