import React from 'react';

import MapMedia from '@/components/pages/map/media/MapMedia';
import { MapCustomPanelTabs } from '@/components/pages/map/MapCustom/panel/MapCustomPanel';
import VideoPlayer from '@/components/Ui/Player/VideoPlayer';
import { Spot } from '@krak/carrelage-client';
import MapSearchResultSpot from '@/components/pages/map/MapNavigation/MapSearch/MapSearchResults/MapSearchResultSpot';
import { useSpotID } from '@/lib/hook/queryState';
import { useMap } from 'react-map-gl';
import { Media } from '@/shared/feudartifice/types';

type Props = {
    activeTab: MapCustomPanelTabs;
    videos: string[];
    spots: Spot[];
    medias: Media[];
    soundtrack: string[];
};

const Content = ({ videos, spots, activeTab, medias, soundtrack }: Props) => {
    const [, selectSpot] = useSpotID();
    const { current: currentMap } = useMap();

    if (activeTab === 'media' && medias.length > 0) {
        return medias.map((media) => <MapMedia key={media.id} media={media} isFromCustomMapFeed />);
    }
    if (activeTab === 'video' && videos.length > 0) {
        return videos.map((video) => <VideoPlayer key={video} url={video} controls />);
    }
    if (activeTab === 'soundtrack' && soundtrack.length > 0) {
        return (
            <ul className="flex flex-col gap-4 py-4 items-center">
                {soundtrack.map((track) => (
                    <>
                        <li key={track} className="text-sm text-center">
                            {track}
                        </li>
                        <div className="h-px w-16 bg-onDark-placeholder last-of-type:hidden" />
                    </>
                ))}
            </ul>
        );
    }
    if (activeTab === 'spots' && spots.length > 0) {
        return (
            <div className="flex flex-col">
                {spots.map((spot: Spot) => (
                    <MapSearchResultSpot
                        key={spot.id}
                        spot={spot}
                        onSpotClick={() => {
                            if (spot.location.latitude && spot.location.longitude) {
                                currentMap?.flyTo({
                                    center: {
                                        lat: spot.location.latitude,
                                        lon: spot.location.longitude,
                                    },
                                    duration: 1000,
                                });
                            }
                            selectSpot(spot.id);
                        }}
                    />
                ))}
            </div>
        );
    }
};

export default Content;
