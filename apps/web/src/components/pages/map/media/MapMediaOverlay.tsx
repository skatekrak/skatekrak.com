import React from 'react';
import { useMap } from 'react-map-gl';

import Typography from '@/components/Ui/typography/Typography';

import { Media } from '@krak/carrelage-client';
import SpotIcon from '@/components/Ui/Utils/SpotIcon';
import { useSpotID } from '@/lib/hook/queryState';

type Props = {
    media: Media;
    isFromCustomMapFeed: boolean;
};

const MapMediaOverlaySpotOrUsername = ({ media, isFromCustomMapFeed }: Props) => {
    const { current: map } = useMap();
    const [, selectSpot] = useSpotID();

    if (isFromCustomMapFeed) {
        const { spot } = media;
        if (spot != null) {
            return (
                <button
                    className="text-onDark-highEmphasis bg-transparent flex flex-row items-center hover:underline [&_svg]:w-7"
                    onClick={() => {
                        if (spot.location.latitude && spot.location.longitude) {
                            map?.flyTo({
                                center: {
                                    lat: spot.location.latitude,
                                    lon: spot.location.longitude,
                                },
                                duration: 1000,
                            });
                        }
                        selectSpot(spot.id);
                    }}
                >
                    <SpotIcon spot={spot} />
                    <Typography as="h5" component="condensedSubtitle1">
                        {spot.name}
                    </Typography>
                </button>
            );
        }
        // Don't show anything if the media is not from a spot and we are on the custom map feed
        return <> </>;
    }

    return (
        <Typography as="h5" component="condensedSubtitle1">
            {media.addedBy.username}
        </Typography>
    );
};

const MapMediaOverlay = ({ media, isFromCustomMapFeed }: Props) => {
    return (
        <div className="hidden group-hover:block absolute bottom-0 left-0 right-0 px-4 py-2 bg-[rgba(31,31,31,0.6)] z-[1] [&_.media-overlay-spot_span]:inline [&_.media-overlay-spot_button]:underline [&_.media-overlay-spot_button]:text-onDark-highEmphasis [&_.media-overlay-spot_button]:bg-transparent">
            <MapMediaOverlaySpotOrUsername media={media} isFromCustomMapFeed={isFromCustomMapFeed} />
            {media.caption != null && (
                <Typography className="mt-1 line-clamp-3" component="body2">
                    {media.caption}
                </Typography>
            )}
        </div>
    );
};

export default MapMediaOverlay;
