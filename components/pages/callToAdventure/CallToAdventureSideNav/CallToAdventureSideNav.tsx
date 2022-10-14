import Typography from 'components/Ui/typography/Typography';
import ScrollHelper from 'lib/ScrollHelper';
import React, { useEffect, useRef } from 'react';
import { ctaSections } from '../constants';

import * as S from './CallToAdventureSideNav.styled';

type Props = {
    bodyContentRef: React.MutableRefObject<HTMLDivElement>;
};

const CallToAdventureSideNav = ({ bodyContentRef }: Props) => {
    const sideNavRef = useRef();

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
        const fixedNavTop = websiteNavHeight + 48;

        if (sideNavRef && sideNavRef.current) {
            const nav = sideNavRef.current as HTMLElement;
            const bodyContentTop = bodyContentRef.current.getBoundingClientRect().top;

            if (bodyContentTop < fixedNavTop) {
                nav.style.position = 'fixed';
                nav.style.top = `${fixedNavTop}px`;
            } else {
                nav.style.position = 'relative';
                nav.style.top = 'inherit';
            }
        }
    };

    return (
        <S.CallToAdventureSideNav ref={sideNavRef}>
            <S.CallToAdventureSideNavLink href={`#${ctaSections.TLDR}`} isActive={false}>
                tl;dr
            </S.CallToAdventureSideNavLink>
            <S.CallToAdventureSideNavLink href={`#${ctaSections.EVOLUTION}`} isActive={false}>
                skateboarding evolution
            </S.CallToAdventureSideNavLink>
            <S.CallToAdventureSideNavLink href={`#${ctaSections.ARCHIVING}`} isActive={false}>
                why archiving is important
            </S.CallToAdventureSideNavLink>
            <S.CallToAdventureSideNavLink href={`#${ctaSections.ABOUT}`} isActive={false}>
                who we are
            </S.CallToAdventureSideNavLink>
            <S.CallToAdventureSideNavLink href={`#${ctaSections.DONE}`} isActive={false}>
                what we’ve done
            </S.CallToAdventureSideNavLink>
            <S.CallToAdventureIsTyping>
                <S.CallToAdventureIsTypingKrak component="subtitle2">Krak</S.CallToAdventureIsTypingKrak>
                <Typography as="span" component="body2">
                    is typing
                </Typography>
                <S.CallToAdventureIsTypingAnimation delay={-0.2}>.</S.CallToAdventureIsTypingAnimation>
                <S.CallToAdventureIsTypingAnimation delay={-0.1}>.</S.CallToAdventureIsTypingAnimation>
                <S.CallToAdventureIsTypingAnimation>.</S.CallToAdventureIsTypingAnimation>
            </S.CallToAdventureIsTyping>
        </S.CallToAdventureSideNav>
    );
};

export default CallToAdventureSideNav;
