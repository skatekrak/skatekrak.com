import { useMap } from 'react-map-gl/maplibre';

import type { Media, Spot } from '@krak/contracts';

import MapSearchResultSpot from '@/components/pages/map/MapNavigation/MapSearch/MapSearchResults/MapSearchResultSpot';
import MapMedia from '@/components/pages/map/media/MapMedia';
import VideoPlayer from '@/components/Ui/Player/VideoPlayer';
import { useSpotID } from '@/lib/hook/queryState';

export const MediaTabContent = ({ medias }: { medias: Media[] }) => {
    const [, selectSpot] = useSpotID();
    const { current: currentMap } = useMap();

    return medias.map((media) => (
        <MapMedia
            key={media.id}
            media={media}
            isFromCustomMapFeed
            onSpotClick={(spot) => {
                currentMap?.flyTo({
                    center: { lat: spot.location.latitude, lon: spot.location.longitude },
                    duration: 1000,
                });
                selectSpot(spot.id);
            }}
        />
    ));
};

export const VideoTabContent = ({ videos }: { videos: string[] }) =>
    videos.map((video) => <VideoPlayer key={video} url={video} controls />);

export const SoundtrackTabContent = ({ soundtrack }: { soundtrack: string[] }) => (
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

export const SpotsTabContent = ({ spots }: { spots: Spot[] }) => {
    const [, selectSpot] = useSpotID();
    const { current: currentMap } = useMap();

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
};
