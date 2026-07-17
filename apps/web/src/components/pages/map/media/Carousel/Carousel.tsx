import classnames from 'classnames';
import { useEffect, useState } from 'react';

import type { Media } from '@krak/contracts';
import { useImgproxy } from '@krak/ui';

import IconArrowHead from '@/components/Ui/Icons/ArrowHead';
import IconInfo from '@/components/Ui/Icons/IconInfo';
import VideoPlayer from '@/components/Ui/Player/VideoPlayer';
import Typography from '@/components/Ui/typography/Typography';
import SpotIcon from '@/components/Ui/Utils/SpotIcon';
import { useMediaID, useSpotID, useSpotModal } from '@/lib/hook/queryState';
import { getMediaImageUrl } from '@/lib/media';

import MediaCaption from '../MediaCaption';

export type CarouselProps = {
    media: Media;
    prevMedia: Media | null;
    nextMedia: Media | null;
};

const Carousel = ({ media, nextMedia, prevMedia }: CarouselProps) => {
    return (
        <div className="group relative grow flex flex-col bg-[#141414] overflow-hidden [&_.video-player-container]:h-full">
            <CarouselContent media={media} />
            <CarouselNav media={media} nextMedia={nextMedia} prevMedia={prevMedia} />
        </div>
    );
};

export default Carousel;

export const CarouselNav = ({ media, prevMedia, nextMedia }: CarouselProps) => {
    const isFirst = prevMedia == null;
    const isLast = nextMedia == null;
    const [, setMedia] = useMediaID();
    const [, setSpotID] = useSpotID();
    const [, setModalVisible] = useSpotModal();

    /** Description */
    const [isDescOpen, setIsDescOpen] = useState(false);

    const onPrevious = () => {
        if (prevMedia != null) {
            setMedia(prevMedia.id);
        }
    };

    const onNext = () => {
        if (nextMedia != null) {
            setMedia(nextMedia.id);
        }
    };

    const goBackToSpot = () => {
        setMedia(null);
        setSpotID(media.spot?.id ?? null);
        setModalVisible(true);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                onPrevious();
            } else if (e.key === 'ArrowRight') {
                onNext();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                e.stopImmediatePropagation();
                goBackToSpot();
            }
        };

        document.addEventListener('keydown', handleKeyDown, true);
        return () => document.removeEventListener('keydown', handleKeyDown, true);
    }, [prevMedia, nextMedia]);

    return (
        <div className="grow flex items-center justify-between p-3 transition-all duration-150 tablet:absolute tablet:top-6 tablet:left-6 tablet:flex-col tablet:items-start tablet:justify-start tablet:p-0 tablet:opacity-0 group-hover:opacity-100">
            <nav
                className="
                inline-flex rounded bg-tertiary-dark border-[1.5px] border-tertiary-medium shadow-onDarkHighSharp overflow-hidden
                [&>button]:flex [&>button]:py-2 [&>button]:px-3 
            "
            >
                <button
                    className="items-center text-onDark-mediumEmphasis underline text-sm [&_svg]:w-[1.125rem] [&_svg]:mr-1 [&_svg]:mt-px [&_svg]:fill-onDark-mediumEmphasis [&_svg]:rotate-180 hover:text-onDark-highEmphasis hover:[&_svg]:fill-onDark-highEmphasis"
                    onClick={goBackToSpot}
                >
                    <IconArrowHead />
                    <span>{media.spot?.name}</span>
                </button>
                <div className="my-2 w-px bg-onDark-divider" />
                <button
                    className={classnames('[&_svg]:w-6', {
                        '[&_svg]:fill-onDark-highEmphasis': isDescOpen,
                        '[&_svg]:fill-onDark-mediumEmphasis hover:[&_svg]:fill-onDark-highEmphasis': !isDescOpen,
                    })}
                    onClick={() => setIsDescOpen(!isDescOpen)}
                >
                    <IconInfo />
                </button>
                <div className="my-2 w-px bg-onDark-divider" />
                <button
                    className={classnames('[&_svg]:w-6 [&_svg]:rotate-180', {
                        'cursor-default [&_svg]:fill-onDark-lowEmphasis': isFirst,
                        '[&_svg]:fill-onDark-mediumEmphasis hover:[&_svg]:fill-onDark-highEmphasis': !isFirst,
                    })}
                    onClick={onPrevious}
                    disabled={isFirst}
                >
                    <IconArrowHead />
                </button>
                <div className="my-2 w-px bg-onDark-divider" />
                <button
                    className={classnames('[&_svg]:w-6', {
                        'cursor-default [&_svg]:fill-onDark-lowEmphasis': isLast,
                        '[&_svg]:fill-onDark-mediumEmphasis hover:[&_svg]:fill-onDark-highEmphasis': !isLast,
                    })}
                    onClick={onNext}
                    disabled={isLast}
                >
                    <IconArrowHead />
                </button>
            </nav>
            {isDescOpen && (
                <div className="absolute bottom-[4.125rem] left-0 max-h-[80vh] w-full py-5 px-6 mt-2 rounded bg-tertiary-dark border-[1.5px] border-tertiary-medium shadow-onDarkHighSharp overflow-y-auto tablet:relative tablet:max-w-[24rem] tablet:min-w-[16rem] tablet:max-h-[50vh] tablet:bottom-auto">
                    <Typography component="body2" className="mb-2 text-onDark-lowEmphasis">
                        Uploaded by
                    </Typography>
                    <Typography component="body1">{media.addedBy.username}</Typography>
                    <div className="h-px my-4 mt-4 mb-5 bg-onDark-divider" />
                    {media.spot != null && (
                        <button
                            onClick={goBackToSpot}
                            className="flex items-center text-onDark-mediumEmphasis underline text-sm [&_svg]:w-5 [&_svg]:mr-1"
                        >
                            <SpotIcon spot={media.spot} />
                            {media.spot.name && <Typography component="body2">{media.spot.name}</Typography>}
                        </button>
                    )}
                    {media.caption && (
                        <Typography component="body1" className="leading-[1.8] mt-3">
                            <MediaCaption caption={media.caption} />
                        </Typography>
                    )}
                </div>
            )}
        </div>
    );
};

const CarouselContent = ({ media }: { media: Media }) => {
    const imgproxy = useImgproxy();

    if (media.type === 'video' && media.video != null) {
        return <VideoPlayer style={{ paddingTop: 'inherit' }} url={media.video.url} loop controls playing />;
    }

    const src = media.image && imgproxy ? getMediaImageUrl(media.image, imgproxy.baseUrl) : '';

    return <img className="w-full h-full object-contain" src={src} alt={media.caption} />;
};
