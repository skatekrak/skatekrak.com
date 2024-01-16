import React, { useEffect, useRef, useState } from 'react';

import VideoPlayer from 'components/Ui/Player/VideoPlayer';
import IconArrowHead from 'components/Ui/Icons/ArrowHead';
import * as S from './Carousel.styled';

import { Media } from 'lib/carrelageClient';
import Typography from 'components/Ui/typography/Typography';
import SpotIcon from 'components/Ui/Utils/SpotIcon';
import IconInfo from 'components/Ui/Icons/IconInfo';

type Props = {
    additionalActions?: React.ReactElement;
    medias: Media[];
    initialMediaId: string;
    loadMore?: (key: 'previous' | 'next') => void;
    onMediaChange?: (mediaId: string) => void;
};

const Carousel = ({ additionalActions, medias, initialMediaId, loadMore, onMediaChange }: Props) => {
    const initialIndex = medias.findIndex((media) => media.id === initialMediaId);

    const [currentIndex, _setCurrentIndex] = useState(() => initialIndex);

    /** to have access to the updated state in keyboard event */
    const currentIndexRef = useRef(currentIndex);

    /** state and ref updater */
    const setCurrentIndex = (index: number) => {
        _setCurrentIndex(index);
        currentIndexRef.current = index;
    };

    // const currentIndex = currentIndexRef.current;

    /** played media */
    const media = medias[currentIndex];

    const isFirst = currentIndex === 0;
    const isLast = currentIndex === medias.length - 1;

    const onPrevious = (index: number) => {
        if (index > 0) {
            setCurrentIndex(index - 1);
            onMediaChange(medias[index - 1].id);
            loadMore && index < 2 && loadMore('previous');
        }
    };
    const onNext = (index: number) => {
        if (index < medias.length - 1) {
            setCurrentIndex(index + 1);
            onMediaChange(medias[index + 1].id);
            loadMore && index > medias.length - 3 && loadMore('next');
        }
    };

    /** handle with arrow keys down */
    const handleKeydown = (e: KeyboardEvent) => {
        e.key === 'ArrowLeft' && onPrevious(currentIndexRef.current);
        e.key === 'ArrowRight' && onNext(currentIndexRef.current);
    };

    useEffect(() => {
        document.addEventListener('keydown', handleKeydown);
        return () => {
            document.removeEventListener('keydown', handleKeydown);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!media) return <></>;

    return (
        <InternalCarousel
            media={media}
            additionalActions={additionalActions}
            onPrevious={onPrevious}
            onNext={onNext}
            currentIndex={currentIndex}
            isLast={isLast}
            isFirst={isFirst}
        />
    );
};

export default Carousel;

const InternalCarousel = ({ media, additionalActions, onPrevious, onNext, currentIndex, isLast, isFirst }: any) => {
    /** Description */
    const [isDescOpen, setIsDescOpen] = useState(false);

    return (
        <S.Carousel>
            {media.type === 'video' && (
                <VideoPlayer style={{ paddingTop: 'inherit' }} url={media.video.url} loop controls />
            )}
            {media.type === 'image' && <S.Image src={media.image.url} alt={media.caption} />}
            <S.Nav>
                {additionalActions && (
                    <S.NavAdditionalActionsContainer>{additionalActions}</S.NavAdditionalActionsContainer>
                )}
                <S.MenuContainer>
                    <S.Menu>
                        <S.IconButton isActive={isDescOpen} onClick={() => setIsDescOpen(!isDescOpen)}>
                            <IconInfo />
                        </S.IconButton>
                        <S.MenuDivider />
                        <S.IconButton direction="left" onClick={() => onPrevious(currentIndex)} disabled={isFirst}>
                            <IconArrowHead />
                        </S.IconButton>
                        <S.MenuDivider />
                        <S.IconButton onClick={() => onNext(currentIndex)} disabled={isLast}>
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
            </S.Nav>
        </S.Carousel>
    );
};
