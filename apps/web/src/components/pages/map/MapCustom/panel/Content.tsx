import React, { useMemo } from 'react';

import { KrakLoading } from '@/components/Ui/Icons/Spinners';
import MapMedia from '@/components/pages/map/media/MapMedia';
import { useMedias } from '@/shared/feudartifice/hooks/media';
import { MapCustomPanelTabs } from '@/components/pages/map/MapCustom/panel/MapCustomPanel';
import { CustomMap } from '@/lib/map/types';
import VideoPlayer from '@/components/Ui/Player/VideoPlayer';
import { Spot } from '@krak/carrelage-client';
import MapSearchResultSpot from '@/components/pages/map/MapNavigation/MapSearch/MapSearchResults/MapSearchResultSpot';
import { useSpotID } from '@/lib/hook/queryState';
import { useMap } from 'react-map-gl';

type Props = {
    map: CustomMap;
    spots: Spot[];
    activeTab: MapCustomPanelTabs;
};

const Content = ({ map, spots, activeTab }: Props) => {
    const { id, videos } = map;

    const [, selectSpot] = useSpotID();
    const { current: currentMap } = useMap();

    const today = useMemo(() => {
        return new Date();
    }, []);

    const { data: medias, isLoading } = useMedias({
        older: today,
        limit: 10,
        hashtag: id,
    });

    if (isLoading) {
        return <KrakLoading />;
    }

    if (activeTab === 'media') {
        if (medias && medias.length > 0) {
            return medias?.map((media) => <MapMedia key={media.id} media={media} isFromCustomMapFeed />);
        } else {
            return <NoContent />;
        }
    }
    if (activeTab === 'video') {
        if (videos?.length > 0) {
            return videos.map((video) => <VideoPlayer key={video} url={video} controls />);
        } else {
            return <NoContent />;
        }
    }
    if (activeTab === 'spots') {
        if (spots.length > 0) {
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
        } else {
            return <NoContent />;
        }
    }
};

export default Content;

const NoContent = () => <div className="m-auto text-onDark-lowEmphasis">No content yet</div>;
