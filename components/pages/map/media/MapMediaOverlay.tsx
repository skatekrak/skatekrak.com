import React from 'react';
import { useMap } from 'react-map-gl';

import Typography from 'components/Ui/typography/Typography';
import * as S from './MapMedia.styled';

import { selectSpot } from 'store/map/slice';
import { Media } from 'lib/carrelageClient';
import { useAppDispatch } from 'store/hook';

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
                <span className="media-overlay-spot">
                    <Typography as="span" component="condensedBody1">
                        spot:{' '}
                    </Typography>
                    <button
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
                        <Typography as="h5" component="condensedSubtitle1">
                            {media.spot.name}
                        </Typography>
                    </button>
                </span>
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
