import React from 'react';

import Typography from 'components/Ui/typography/Typography';
import * as S from 'components/pages/map/MapFullSpot/MapFullSpotMain/MapFullSpotMain.styled';

import { Media } from 'lib/carrelageClient';

const MapFullSpotMediaOverlay = ({ media }: { media: Media }) => (
    <S.MapFullSpotMainMediaOverlay>
        <Typography as="h5" component="condensedSubtitle1">
            {media.addedBy.username}
        </Typography>
        {media.caption != null && (
            <S.MapFullSpotMainMediaOverlayCaption component="body2" truncateLines={3}>
                {media.caption}
            </S.MapFullSpotMainMediaOverlayCaption>
        )}
    </S.MapFullSpotMainMediaOverlay>
);

export default MapFullSpotMediaOverlay;
