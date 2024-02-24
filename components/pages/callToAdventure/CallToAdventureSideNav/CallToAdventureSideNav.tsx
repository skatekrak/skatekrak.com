import ScrollHelper from 'lib/ScrollHelper';
import React, { ElementRef, useEffect, useRef, useState } from 'react';
import { ctaSections } from '../constants';

import * as S from './CallToAdventureSideNav.styled';
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

    return (
        <S.CallToAdventureSideNav ref={sideNavRef}>
            <S.CallToAdventureSideNavLink
                href={`#${ctaSections.TLDR}`}
                isActive={currentSectionInView === ctaSections.TLDR}
            >
                tl;dr
            </S.CallToAdventureSideNavLink>
            <S.CallToAdventureSideNavLink
                href={`#${ctaSections.EVOLUTION}`}
                isActive={currentSectionInView === ctaSections.EVOLUTION}
            >
                skateboarding evolution
            </S.CallToAdventureSideNavLink>
            <S.CallToAdventureSideNavLink
                href={`#${ctaSections.ARCHIVING}`}
                isActive={currentSectionInView === ctaSections.ARCHIVING}
            >
                why archiving is important
            </S.CallToAdventureSideNavLink>
            <S.CallToAdventureSideNavLink
                href={`#${ctaSections.ABOUT}`}
                isActive={currentSectionInView === ctaSections.ABOUT}
            >
                who we are
            </S.CallToAdventureSideNavLink>
            <CallToAdventureSubNav currentSectionInView={currentSectionInView} />
            {/* <S.CallToAdventureSideNavLink
                href={`#${ctaSections.DONE}`}
                isActive={currentSectionInView === ctaSections.DONE}
            >
                what we’ve done
            </S.CallToAdventureSideNavLink>
            <S.CallToAdventureSideNavSubNav>
                <S.CallToAdventureSideNavLink
                    href={`#${ctaSections.DONE}`}
                    isActive={currentSectionInView === ctaSections.DONE}
                >
                    hardware device
                </S.CallToAdventureSideNavLink>
            </S.CallToAdventureSideNavSubNav> */}
            <S.CallToAdventureSideNavLink
                href={`#${ctaSections.VISION}`}
                isActive={currentSectionInView === ctaSections.VISION}
            >
                where we’re heading to
            </S.CallToAdventureSideNavLink>
            <S.CallToAdventureSideNavLink
                href={`#${ctaSections.DAO}`}
                isActive={currentSectionInView === ctaSections.DAO}
            >
                why a DAO + co-op
            </S.CallToAdventureSideNavLink>
            <S.CallToAdventureSideNavLink
                href={`#${ctaSections.FINAL}`}
                isActive={currentSectionInView === ctaSections.FINAL}
            >
                final words - world-building
            </S.CallToAdventureSideNavLink>
        </S.CallToAdventureSideNav>
    );
};

export default CallToAdventureSideNav;
