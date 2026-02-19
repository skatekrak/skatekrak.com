import ScrollHelper from '@/lib/ScrollHelper';
import React, { ElementRef, useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import { ctaSections } from '../constants';

import CallToAdventureSubNav from './CallToAdventureSubNav';

type Props = {
    bodyContentRef: React.MutableRefObject<HTMLDivElement | null>;
};

const CallToAdventureSideNav = ({ bodyContentRef }: Props) => {
    const sideNavRef = useRef<ElementRef<'div'> | null>(null);

    useEffect(() => {
        const scrollContainer = ScrollHelper.getScrollContainer();
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', () => handleScroll());
        }

        return () => scrollContainer && scrollContainer.removeEventListener('scroll', handleScroll);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleScroll = () => {
        // website navigation height
        const websiteNavHeight = 66;
        // Offset the moment the nav got fixed
        // const fixedNavTop = websiteNavHeight + 48;

        if (sideNavRef && sideNavRef.current) {
            const nav = sideNavRef.current as HTMLElement;
            const bodyContentTop = bodyContentRef.current?.getBoundingClientRect().top;

            if (bodyContentTop != null && bodyContentTop < websiteNavHeight) {
                nav.style.position = 'fixed';
                nav.style.top = `${websiteNavHeight}px`;
            } else {
                nav.style.position = 'relative';
                nav.style.top = 'inherit';
            }
        }
    };

    const [currentSectionInView, setCurrentSectionInView] = useState<ctaSections>();

    useEffect(() => {
        const callback: IntersectionObserverCallback = function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    if (id != null) setCurrentSectionInView(id as ctaSections);
                }
            });
        };

        const spies = document.querySelectorAll('[data-spy]');

        const y = Math.round(window.innerHeight * 0.6);

        if (spies.length > 0) {
            const observer = new IntersectionObserver(callback, {
                rootMargin: `-${window.innerHeight - y - 1}px 0px -${y}px 0px`,
            });
            spies.forEach((spy) => {
                observer.observe(spy);
            });
        }
    }, []);

    const linkClasses = (isActive: boolean) =>
        classnames('block py-3 text-onDark-mediumEmphasis cursor-pointer hover:text-onDark-highEmphasis', {
            'font-roboto-bold text-onDark-highEmphasis': isActive,
        });

    return (
        <div
            className="hidden laptop-s:flex laptop-s:flex-col laptop-s:w-full laptop-s:max-w-[10rem] laptop-s:mt-8 laptop:max-w-[13rem]"
            ref={sideNavRef}
        >
            <a href={`#${ctaSections.TLDR}`} className={linkClasses(currentSectionInView === ctaSections.TLDR)}>
                tl;dr
            </a>
            <a
                href={`#${ctaSections.EVOLUTION}`}
                className={linkClasses(currentSectionInView === ctaSections.EVOLUTION)}
            >
                skateboarding evolution
            </a>
            <a
                href={`#${ctaSections.ARCHIVING}`}
                className={linkClasses(currentSectionInView === ctaSections.ARCHIVING)}
            >
                why archiving is important
            </a>
            <a href={`#${ctaSections.ABOUT}`} className={linkClasses(currentSectionInView === ctaSections.ABOUT)}>
                who we are
            </a>
            <CallToAdventureSubNav currentSectionInView={currentSectionInView} />
            <a href={`#${ctaSections.VISION}`} className={linkClasses(currentSectionInView === ctaSections.VISION)}>
                where we&apos;re heading to
            </a>
            <a href={`#${ctaSections.DAO}`} className={linkClasses(currentSectionInView === ctaSections.DAO)}>
                why a DAO + co-op
            </a>
            <a href={`#${ctaSections.FINAL}`} className={linkClasses(currentSectionInView === ctaSections.FINAL)}>
                final words - world-building
            </a>
        </div>
    );
};

export default CallToAdventureSideNav;
