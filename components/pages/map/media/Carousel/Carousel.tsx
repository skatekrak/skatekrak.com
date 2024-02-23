import React, { useState } from 'react';

import VideoPlayer from 'components/Ui/Player/VideoPlayer';
import IconArrowHead from 'components/Ui/Icons/ArrowHead';
import * as S from './Carousel.styled';

import Typography from 'components/Ui/typography/Typography';
import SpotIcon from 'components/Ui/Utils/SpotIcon';
import IconInfo from 'components/Ui/Icons/IconInfo';
import { useAppDispatch } from 'store/hook';
import { setMedia } from 'store/map/slice';
import { Media } from 'lib/carrelageClient';

type CarouselMediaProps = {
    media: Media;
    prevMedia: Media | null;
    nextMedia: Media | null;
};

export type CarouselProps = CarouselMediaProps & {
    additionalActions?: React.ReactNode;
};

const Carousel = ({ media, nextMedia, prevMedia, additionalActions }: CarouselProps) => {
    return (
        <S.Carousel>
            <CarouselContent media={media} />
            <S.Nav>
                {additionalActions && (
                    <S.NavAdditionalActionsContainer>{additionalActions}</S.NavAdditionalActionsContainer>
                )}
                <CarouselNav media={media} nextMedia={nextMedia} prevMedia={prevMedia} />
            </S.Nav>
        </S.Carousel>
    );
};

export default Carousel;

export const CarouselNav = ({ media, prevMedia, nextMedia }: CarouselMediaProps) => {
    const dispatch = useAppDispatch();
    const isFirst = prevMedia == null;
    const isLast = nextMedia == null;

    /** Description */
    const [isDescOpen, setIsDescOpen] = useState(false);

    const onPrevious = () => {
        if (prevMedia != null) {
            dispatch(setMedia(prevMedia.id));
        }
    };

    const onNext = () => {
        if (nextMedia != null) {
            dispatch(setMedia(nextMedia.id));
        }
    };

    /** handle with arrow keys down */
    // const handleKeydown = (e: KeyboardEvent) => {
    //     e.key === 'ArrowLeft' && onPrevious();
    //     e.key === 'ArrowRight' && onNext();
    // };

    // useEffect(() => {
    //     document.addEventListener('keydown', handleKeydown);
    //     return () => {
    //         document.removeEventListener('keydown', handleKeydown);
    //     };
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    return (
        <S.MenuContainer>
            <S.Menu>
                <S.IconButton isActive={isDescOpen} onClick={() => setIsDescOpen(!isDescOpen)}>
                    <IconInfo />
                </S.IconButton>
                <S.MenuDivider />
                <S.IconButton direction="left" onClick={onPrevious} disabled={isFirst}>
                    <IconArrowHead />
                </S.IconButton>
                <S.MenuDivider />
                <S.IconButton onClick={onNext} disabled={isLast}>
                    <IconArrowHead />
                </S.IconButton>
            </S.Menu>
            {isDescOpen && (
                <S.MediaDescription>
                    <S.MediaDescriptionUploadedBy component="body2">Uploaded by</S.MediaDescriptionUploadedBy>
                    <Typography component="body1">{media.addedBy.username}</Typography>
                    <S.MediaDescriptionDivider />
                    <S.MediaDescriptionSpot>
                        <SpotIcon spot={media.spot} />
                        {media.spot.name && <Typography component="body2">{media.spot.name}</Typography>}
                    </S.MediaDescriptionSpot>
                    {media.caption && (
                        <S.MediaDescriptionCaption component="body1">{media.caption}</S.MediaDescriptionCaption>
                    )}
                </S.MediaDescription>
            )}
        </S.MenuContainer>
    );
};

const CarouselContent = ({ media }: { media: Media }) => {
    if (media.type === 'video') {
        return <VideoPlayer style={{ paddingTop: 'inherit' }} url={media.video.url} loop controls playing />;
    }

    return <S.Image src={media.image.url} alt={media.caption} />;
};
