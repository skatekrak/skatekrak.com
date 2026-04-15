import React from 'react';

import { useFullSpotSelectedTab } from '@/lib/hook/queryState';
import { useMapStore } from '@/store/map';

import MapFullSpotEdito from './Edito';
import MapFullSpotInfo from './Info';
import MapFullSpotAddClip from './MapFullSpotAdd/MapFullSpotAddClip';
import MapFullSpotAddMedia from './MapFullSpotAdd/MapFullSpotAddMedia';
import MapFullSpotMainClips from './MapFullSpotMainClips';
import MapFullSpotMedias from './MapFullSpotMedias';
import MapFullSpotTips from './Tips';

const MapFullSpotMain = () => {
    const [selectedTab] = useFullSpotSelectedTab();
    const spotOverview = useMapStore((state) => state.spotOverview);

    if (spotOverview) {
        return (
            <>
                {selectedTab === 'clips' && <MapFullSpotMainClips spot={spotOverview.spot} />}
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
