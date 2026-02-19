import React, { useEffect, useState } from 'react';
import classnames from 'classnames';

import { ctaSections } from '../../constants';
import ArrowHead from '@/components/Ui/Icons/ArrowHead';

type Props = {
    currentSectionInView: ctaSections | undefined;
};

const CallToAdventureSubNav = ({ currentSectionInView }: Props) => {
    const [isOpen, setIsOpen] = useState(false);

    const isActive =
        currentSectionInView === ctaSections.DONE ||
        currentSectionInView === ctaSections.HARDWARE ||
        currentSectionInView === ctaSections.KRAKAPP ||
        currentSectionInView === ctaSections.KRAKBOX ||
        currentSectionInView === ctaSections.KRAKMAG ||
        currentSectionInView === ctaSections.YOUTUBE ||
        currentSectionInView === ctaSections.COLLABS ||
        currentSectionInView === ctaSections.EVENTS ||
        currentSectionInView === ctaSections.KRAKSESSION ||
        currentSectionInView === ctaSections.FEED ||
        currentSectionInView === ctaSections.MAP ||
        currentSectionInView === ctaSections.DISCORD;

    useEffect(() => {
        if (isActive) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [currentSectionInView, isActive]);

    const subNavLinkClasses = (isLinkActive: boolean) =>
        classnames('block py-2 px-2 text-sm text-onDark-mediumEmphasis cursor-pointer hover:text-onDark-highEmphasis', {
            'font-roboto-bold text-onDark-highEmphasis': isLinkActive,
        });

    return (
        <div className="flex flex-col">
            <a
                className={classnames(
                    'flex items-center py-3 text-onDark-mediumEmphasis cursor-pointer hover:text-onDark-highEmphasis hover:[&_svg]:fill-onDark-highEmphasis [&_svg]:w-5 [&_svg]:ml-auto [&_svg]:fill-onDark-mediumEmphasis',
                    {
                        'font-roboto-bold text-onDark-highEmphasis [&_svg]:rotate-90': isOpen,
                    },
                )}
                onClick={() => setIsOpen(!isOpen)}
            >
                what we&apos;ve done
                <ArrowHead />
            </a>
            {isOpen && (
                <div className="flex flex-col ml-3">
                    <a
                        href={`#${ctaSections.HARDWARE}`}
                        className={subNavLinkClasses(currentSectionInView === ctaSections.HARDWARE)}
                    >
                        hardware device
                    </a>
                    <a
                        href={`#${ctaSections.KRAKAPP}`}
                        className={subNavLinkClasses(currentSectionInView === ctaSections.KRAKAPP)}
                    >
                        Krak app
                    </a>
                    <a
                        href={`#${ctaSections.KRAKBOX}`}
                        className={subNavLinkClasses(currentSectionInView === ctaSections.KRAKBOX)}
                    >
                        KrakBox
                    </a>
                    <a
                        href={`#${ctaSections.KRAKMAG}`}
                        className={subNavLinkClasses(currentSectionInView === ctaSections.KRAKMAG)}
                    >
                        KrakMag
                    </a>
                    <a
                        href={`#${ctaSections.YOUTUBE}`}
                        className={subNavLinkClasses(currentSectionInView === ctaSections.YOUTUBE)}
                    >
                        Youtube channel
                    </a>
                    <a
                        href={`#${ctaSections.COLLABS}`}
                        className={subNavLinkClasses(currentSectionInView === ctaSections.COLLABS)}
                    >
                        collabs and merch
                    </a>
                    <a
                        href={`#${ctaSections.EVENTS}`}
                        className={subNavLinkClasses(currentSectionInView === ctaSections.EVENTS)}
                    >
                        events
                    </a>
                    <a
                        href={`#${ctaSections.KRAKSESSION}`}
                        className={subNavLinkClasses(currentSectionInView === ctaSections.KRAKSESSION)}
                    >
                        Krak Session app
                    </a>
                    <a
                        href={`#${ctaSections.FEED}`}
                        className={subNavLinkClasses(currentSectionInView === ctaSections.FEED)}
                    >
                        video and news feed
                    </a>
                    <a
                        href={`#${ctaSections.MAP}`}
                        className={subNavLinkClasses(currentSectionInView === ctaSections.MAP)}
                    >
                        skatespots map
                    </a>
                    <a
                        href={`#${ctaSections.DISCORD}`}
                        className={subNavLinkClasses(currentSectionInView === ctaSections.DISCORD)}
                    >
                        Discord community
                    </a>
                </div>
            )}
        </div>
    );
};

export default CallToAdventureSubNav;
