import VideoPlayer from 'components/Ui/Player/VideoPlayer';
import React from 'react';

import * as S from './MapFullSpotAddClip.styled';

const MapFullSpotAddClip = () => {
    return (
        <S.MapFullSpotAddClipContainer>
            <S.MapFullSpotAddClipTitle component="heading6">
                Attach a Youtube video or Vimeo to this spot
            </S.MapFullSpotAddClipTitle>
            <S.MapFullSpotAddClipInput placeholder="Paste link here" />
            <S.MapFullSpotAddClipSubmit disabled>Add clip</S.MapFullSpotAddClipSubmit>
            <S.MapFullSpotAddClipPreviewTitle component="heading6">Static title</S.MapFullSpotAddClipPreviewTitle>
            <VideoPlayer />
        </S.MapFullSpotAddClipContainer>
    );
};

export default MapFullSpotAddClip;
