import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import Typings from 'Types';

import MapFullSpotEdito from './Edito';
import MapFullSpotInfo from './Info';
import MapFullSpotTips from './Tips';
import MapFullSpotMainClips from './MapFullSpotMainClips';
import MapFullSpotPhotos from './MapFullSpotPhotos';

const MapFullSpotMain = () => {
    const selectedTab = useSelector((state: Typings.RootState) => state.map.fullSpotSelectedTab);
    const spotOverview = useSelector((state: Typings.RootState) => state.map.spotOverview);

    const photos = useMemo(() => {
        return spotOverview.medias.filter((media) => media.type === 'image');
    }, [spotOverview.medias]);

    if (spotOverview) {
        return (
            <>
                {selectedTab === 'clips' && (
                    <MapFullSpotMainClips clips={spotOverview.clips} spot={spotOverview.spot} />
                )}
                {selectedTab === 'photos' && <MapFullSpotPhotos photos={photos} spot={spotOverview.spot} />}
                {selectedTab === 'info' && <MapFullSpotInfo />}
                {selectedTab === 'tips' && <MapFullSpotTips />}
                {selectedTab === 'edito' && <MapFullSpotEdito />}
            </>
        );
    }

    return <div />;
};

export default MapFullSpotMain;
