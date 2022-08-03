import React from 'react';

import ArrowHead from 'components/Ui/Icons/ArrowHead';
import Typography from 'components/Ui/typography/Typography';
import * as S from './MapFullSpotSingleMediaPreview.styled';
import VideoPlayer from 'components/Ui/Player/VideoPlayer';
import { useAppDispatch } from 'store/hook';
import { updateUrlParams } from 'store/map/slice';
import useMedia from 'shared/feudartifice/hooks/media';
import { KrakLoading } from 'components/Ui/Icons/Spinners';

type Props = {
    mediaId: string;
};

const MapFullSpotSingleMediaPreview = ({ mediaId }: Props) => {
    const dispatch = useAppDispatch();
    const { isLoading, data: media } = useMedia(mediaId);

    const goBackToMediaGallery = () => {
        dispatch(updateUrlParams({ mediaId: null }));
    };

    return (
        <S.MapFullSpotSingleMediaPreview>
            {isLoading ? (
                <KrakLoading />
            ) : (
                <>
                    <S.MapFullSpotSingleMediaNav>
                        <S.MapFullSpotSingleMediaNavBackButton onClick={goBackToMediaGallery}>
                            <ArrowHead />
                            <Typography>Media Gallery</Typography>
                        </S.MapFullSpotSingleMediaNavBackButton>
                    </S.MapFullSpotSingleMediaNav>
                    <S.MapFullSpotSingleMediaContainer>
                        {media.type === 'video' && <VideoPlayer url={media.video.url} loop controls />}
                        {media.type === 'image' && (
                            <S.MapFullSpotSingleMediaImage src={media.image.url} alt={media.caption} />
                        )}
                    </S.MapFullSpotSingleMediaContainer>
                    <S.MapFullSpotSingleCaptionContainer>
                        <Typography component="condensedHeading6">{media.addedBy.username}</Typography>
                        {media.caption && (
                            <S.MapFullSpotSingleCaptionDesc>{media.caption}</S.MapFullSpotSingleCaptionDesc>
                        )}
                    </S.MapFullSpotSingleCaptionContainer>
                </>
            )}
        </S.MapFullSpotSingleMediaPreview>
    );
};

export default MapFullSpotSingleMediaPreview;
