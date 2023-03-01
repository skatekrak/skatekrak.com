import React from 'react';

import Typography from 'components/Ui/typography/Typography';
import * as S from './MapMedia.styled';

import { Media } from 'lib/carrelageClient';

const MapMediaOverlay = ({ media }: { media: Media }) => (
    <S.MapMediaOverlay>
        <Typography as="h5" component="condensedSubtitle1">
            {media.addedBy.username}
        </Typography>
        {media.caption != null && (
            <S.MapMediaOverlayCaption component="body2" truncateLines={3}>
                {media.caption}
            </S.MapMediaOverlayCaption>
        )}
    </S.MapMediaOverlay>
);

export default MapMediaOverlay;
