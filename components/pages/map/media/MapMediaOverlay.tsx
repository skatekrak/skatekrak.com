import React from 'react';
import { useMap } from 'react-map-gl';

import Typography from 'components/Ui/typography/Typography';
import * as S from './MapMedia.styled';

import { selectSpot } from 'store/map/slice';
import { Media } from 'lib/carrelageClient';
import { useAppDispatch } from 'store/hook';
import SpotIcon from 'components/Ui/Utils/SpotIcon';

type Props = {
    media: Media;
    isFromCustomMapFeed: boolean;
};

const MapMediaOverlaySpotOrUsername = ({ media, isFromCustomMapFeed }: Props) => {
    const { current: map } = useMap();
    const dispatch = useAppDispatch();

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
                        dispatch(selectSpot(spot.id));
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
