import React, { useEffect, useState } from 'react';

import VideoPlayer from 'components/Ui/Player/VideoPlayer';
import IconArrowHead from 'components/Ui/Icons/ArrowHead';
import * as S from './Carousel.styled';

import { useSpotMediasAround } from 'lib/hook/carrelage/spot-medias';
import Typography from 'components/Ui/typography/Typography';
import SpotIcon from 'components/Ui/Utils/SpotIcon';
import IconInfo from 'components/Ui/Icons/IconInfo';
import { useAppDispatch } from 'store/hook';
import { setMedia } from 'store/map/slice';
import { useCarouselContext } from './CarouselContext';

type Props = {
    additionalActions?: React.ReactNode;
};

const Carousel = ({ additionalActions }: Props) => {
    return (
        <S.Carousel>
            <CarouselContent />
            <S.Nav>
                {additionalActions && (
                    <S.NavAdditionalActionsContainer>{additionalActions}</S.NavAdditionalActionsContainer>
                )}
                <CarouselNav />
            </S.Nav>
        </S.Carousel>
    );
};

export default Carousel;

export const CarouselNav = () => {
    const { media, spot } = useCarouselContext();
    const dispatch = useAppDispatch();
    const { data } = useSpotMediasAround(spot.id, media);
    const isFirst = data?.prevMedia == null;
    const isLast = data?.nextMedia == null;

    /** Description */
    const [isDescOpen, setIsDescOpen] = useState(false);

    const onPrevious = () => {
        if (data.prevMedia != null) {
            dispatch(setMedia(data.prevMedia.id));
        }
    };

    const onNext = () => {
        if (data.nextMedia != null) {
            dispatch(setMedia(data.nextMedia.id));
        }
    };

    /** handle with arrow keys down */
    const handleKeydown = (e: KeyboardEvent) => {
        e.key === 'ArrowLeft' && onPrevious();
        e.key === 'ArrowRight' && onNext();
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeydown);
        return () => {
            document.removeEventListener('keydown', handleKeydown);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                        <Typography component="body2">{media.spot.name}</Typography>
                    </S.MediaDescriptionSpot>
                    {media.caption && (
                        <S.MediaDescriptionCaption component="body1">{media.caption}</S.MediaDescriptionCaption>
                    )}
                </S.MediaDescription>
            )}
        </S.MenuContainer>
    );
};

export const CarouselContent = () => {
    const { media } = useCarouselContext();
    if (media.type === 'video') {
        return <VideoPlayer style={{ paddingTop: 'inherit' }} url={media.video.url} loop controls playing={false} />;
    }

    return <S.Image src={media.image.url} alt={media.caption} />;
};
