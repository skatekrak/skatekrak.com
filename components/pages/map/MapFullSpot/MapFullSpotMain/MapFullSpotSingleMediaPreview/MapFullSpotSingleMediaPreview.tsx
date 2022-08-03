import React from 'react';

import ArrowHead from 'components/Ui/Icons/ArrowHead';
import Typography from 'components/Ui/typography/Typography';
import * as S from './MapFullSpotSingleMediaPreview.styled';
import VideoPlayer from 'components/Ui/Player/VideoPlayer';
import { useAppDispatch } from 'store/hook';
import { updateUrlParams } from 'store/map/slice';

type Props = {
    mediaId: string;
};

const MapFullSpotSingleMediaPreview = ({ mediaId }: Props) => {
    const dispatch = useAppDispatch();

    const goBackToMediaGallery = () => {
        dispatch(updateUrlParams({ mediaId: null }));
    };

    const fakeImage = {
        id: mediaId,
        url: 'https://www.evo-spirit.com/wp-content/uploads/2021/02/Quel-skate-electrique-choisir-Guide-Evo-spiri-tout-terrain-longboard-street-cross-scaled.jpg',
        // url: 'https://ffroller.fr/wp-content/uploads/11009220_674253722680726_4546329174865534472_n.jpg',
        desc: 'asdas',
        addedBy: 'donalduck',
        type: 'image',
    };

    const fakeVideo = {
        id: mediaId,
        // url: 'https://res.cloudinary.com/krak/video/upload/v1550217952/medias/dmhgludlfbhx52jngf0q.mp4',
        // url: 'https://res.cloudinary.com/krak/video/upload/v1521144197/medias/ll9xo9djhzcoih2lynud.mp4',
        url: 'https://res.cloudinary.com/krak/video/upload/v1554838061/medias/kv87ozz6nvyohbp1yqr4.mp4',
        desc: 'asdas',
        addedBy: 'donalduck',
        type: 'video',
    };

    const media = fakeVideo;

    return (
        <S.MapFullSpotSingleMediaPreview>
            <S.MapFullSpotSingleMediaNav>
                <S.MapFullSpotSingleMediaNavBackButton onClick={goBackToMediaGallery}>
                    <ArrowHead />
                    <Typography>Media Gallery</Typography>
                </S.MapFullSpotSingleMediaNavBackButton>
            </S.MapFullSpotSingleMediaNav>
            <S.MapFullSpotSingleMediaContainer>
                {media.type === 'video' && <VideoPlayer url={media.url} loop controls />}
                {media.type === 'image' && <S.MapFullSpotSingleMediaImage src={media.url} alt={media.desc} />}
            </S.MapFullSpotSingleMediaContainer>
            <S.MapFullSpotSingleCaptionContainer>
                <Typography component="condensedHeading6">{media.addedBy}</Typography>
                {media.desc && <S.MapFullSpotSingleCaptionDesc>{media.desc}</S.MapFullSpotSingleCaptionDesc>}
            </S.MapFullSpotSingleCaptionContainer>
        </S.MapFullSpotSingleMediaPreview>
    );
};

export default MapFullSpotSingleMediaPreview;
