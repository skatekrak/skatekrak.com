import React from 'react';
import { useMap } from 'react-map-gl';

import Typography from '@/components/Ui/typography/Typography';
import * as S from './MapMedia.styled';

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
                <S.MapMediaSpotButton
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
                </S.MapMediaSpotButton>
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
        <S.MapMediaOverlay>
            <MapMediaOverlaySpotOrUsername media={media} isFromCustomMapFeed={isFromCustomMapFeed} />
            {media.caption != null && (
                <S.MapMediaOverlayCaption component="body2" truncateLines={3}>
                    {media.caption}
                </S.MapMediaOverlayCaption>
            )}
        </S.MapMediaOverlay>
    );
};

export default MapMediaOverlay;
