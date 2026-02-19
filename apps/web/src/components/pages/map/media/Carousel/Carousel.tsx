import React, { useState } from 'react';
import classnames from 'classnames';

import VideoPlayer from '@/components/Ui/Player/VideoPlayer';
import IconArrowHead from '@/components/Ui/Icons/ArrowHead';

import Typography from '@/components/Ui/typography/Typography';
import SpotIcon from '@/components/Ui/Utils/SpotIcon';
import IconInfo from '@/components/Ui/Icons/IconInfo';
import { Media } from '@krak/carrelage-client';
import { useMediaID } from '@/lib/hook/queryState';

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
        <div className="group relative grow flex flex-col bg-[#141414] overflow-hidden [&_.video-player-container]:h-full">
            <CarouselContent media={media} />
            <div className="grow flex items-center justify-between p-3 transition-all duration-150 tablet:absolute tablet:top-6 tablet:left-6 tablet:flex-col tablet:items-start tablet:justify-start tablet:p-0 tablet:opacity-0 group-hover:opacity-100">
                {additionalActions && <div className="tablet:mb-4">{additionalActions}</div>}
                <CarouselNav media={media} nextMedia={nextMedia} prevMedia={prevMedia} />
            </div>
        </div>
    );
};

export default Carousel;

export const CarouselNav = ({ media, prevMedia, nextMedia }: CarouselMediaProps) => {
    const isFirst = prevMedia == null;
    const isLast = nextMedia == null;
    const [, setMedia] = useMediaID();

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

    return (
        <div>
            <nav className="inline-flex rounded bg-tertiary-dark border-[1.5px] border-tertiary-medium shadow-onDarkHighSharp overflow-hidden">
                <button
                    className={classnames('flex py-2 px-3 [&_svg]:w-6', {
                        '[&_svg]:fill-onDark-highEmphasis': isDescOpen,
                        '[&_svg]:fill-onDark-mediumEmphasis hover:[&_svg]:fill-onDark-highEmphasis': !isDescOpen,
                    })}
                    onClick={() => setIsDescOpen(!isDescOpen)}
                >
                    <IconInfo />
                </button>
                <div className="my-2 w-px bg-onDark-divider" />
                <button
                    className={classnames('flex py-2 px-3 [&_svg]:w-6 [&_svg]:rotate-180', {
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
                    className={classnames('flex py-2 px-3 [&_svg]:w-6', {
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
                        <button className="flex items-center text-onDark-mediumEmphasis underline text-sm [&_svg]:w-5 [&_svg]:mr-1">
                            <SpotIcon spot={media.spot} />
                            {media.spot.name && <Typography component="body2">{media.spot.name}</Typography>}
                        </button>
                    )}
                    {media.caption && (
                        <Typography component="body1" className="leading-[1.8] mt-3">
                            {media.caption}
                        </Typography>
                    )}
                </div>
            )}
        </div>
    );
};

const CarouselContent = ({ media }: { media: Media }) => {
    if (media.type === 'video' && media.video != null) {
        return <VideoPlayer style={{ paddingTop: 'inherit' }} url={media.video.url} loop controls playing />;
    }

    return <img className="w-full h-full object-contain" src={media.image.url} alt={media.caption} />;
};
