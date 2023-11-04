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

const MapMediaOverlay = ({ media, isFromCustomMapFeed }: Props) => {
    const { current: map } = useMap();
    const dispatch = useAppDispatch();

    return (
        <S.MapMediaOverlay>
            {isFromCustomMapFeed ? (
                <S.MapMediaSpotButton
                    onClick={() => {
                        if (media.spot.location.latitude && media.spot.location.longitude) {
                            map.flyTo({
                                center: {
                                    lat: media.spot.location.latitude,
                                    lon: media.spot.location.longitude,
                                },
                                duration: 1000,
                            });
                        }
                        dispatch(selectSpot(media.spot.id));
                    }}
                >
                    <SpotIcon spot={media.spot} />
                    <Typography as="h5" component="condensedSubtitle1">
                        {media.spot.name}
                    </Typography>
                </S.MapMediaSpotButton>
            ) : (
                <Typography as="h5" component="condensedSubtitle1">
                    {media.addedBy.username}
                </Typography>
            )}
            {media.caption != null && (
                <S.MapMediaOverlayCaption component="body2" truncateLines={3}>
                    {media.caption}
                </S.MapMediaOverlayCaption>
            )}
        </S.MapMediaOverlay>
    );
};

export default MapMediaOverlay;
