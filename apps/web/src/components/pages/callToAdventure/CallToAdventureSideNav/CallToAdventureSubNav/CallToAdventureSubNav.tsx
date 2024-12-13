import React, { useEffect, useState } from 'react';

import * as S from './CallToAdventureSubNav.styled';
import * as SS from '../CallToAdventureSideNav.styled';
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

    return (
        <S.CallToAdventureSubNav>
            <S.CallToAdventureSubNavToggle
                // href={`#${ctaSections.DONE}`}
                $isActive={isOpen}
                onClick={() => setIsOpen(!isOpen)}
            >
                what we’ve done
                <ArrowHead />
            </S.CallToAdventureSubNavToggle>
            {isOpen && (
                <S.CallToAdventureSubNavOptions>
                    <SS.CallToAdventureSideNavLink
                        href={`#${ctaSections.HARDWARE}`}
                        $isActive={currentSectionInView === ctaSections.HARDWARE}
                    >
                        hardware device
                    </SS.CallToAdventureSideNavLink>
                    <SS.CallToAdventureSideNavLink
                        href={`#${ctaSections.KRAKAPP}`}
                        $isActive={currentSectionInView === ctaSections.KRAKAPP}
                    >
                        Krak app
                    </SS.CallToAdventureSideNavLink>
                    <SS.CallToAdventureSideNavLink
                        href={`#${ctaSections.KRAKBOX}`}
                        $isActive={currentSectionInView === ctaSections.KRAKBOX}
                    >
                        KrakBox
                    </SS.CallToAdventureSideNavLink>
                    <SS.CallToAdventureSideNavLink
                        href={`#${ctaSections.KRAKMAG}`}
                        $isActive={currentSectionInView === ctaSections.KRAKMAG}
                    >
                        KrakMag
                    </SS.CallToAdventureSideNavLink>
                    <SS.CallToAdventureSideNavLink
                        href={`#${ctaSections.YOUTUBE}`}
                        $isActive={currentSectionInView === ctaSections.YOUTUBE}
                    >
                        Youtube channel
                    </SS.CallToAdventureSideNavLink>
                    <SS.CallToAdventureSideNavLink
                        href={`#${ctaSections.COLLABS}`}
                        $isActive={currentSectionInView === ctaSections.COLLABS}
                    >
                        collabs and merch
                    </SS.CallToAdventureSideNavLink>
                    <SS.CallToAdventureSideNavLink
                        href={`#${ctaSections.EVENTS}`}
                        $isActive={currentSectionInView === ctaSections.EVENTS}
                    >
                        events
                    </SS.CallToAdventureSideNavLink>
                    <SS.CallToAdventureSideNavLink
                        href={`#${ctaSections.KRAKSESSION}`}
                        $isActive={currentSectionInView === ctaSections.KRAKSESSION}
                    >
                        Krak Session app
                    </SS.CallToAdventureSideNavLink>
                    <SS.CallToAdventureSideNavLink
                        href={`#${ctaSections.FEED}`}
                        $isActive={currentSectionInView === ctaSections.FEED}
                    >
                        video and news feed
                    </SS.CallToAdventureSideNavLink>
                    <SS.CallToAdventureSideNavLink
                        href={`#${ctaSections.MAP}`}
                        $isActive={currentSectionInView === ctaSections.MAP}
                    >
                        skatespots map
                    </SS.CallToAdventureSideNavLink>
                    <SS.CallToAdventureSideNavLink
                        href={`#${ctaSections.DISCORD}`}
                        $isActive={currentSectionInView === ctaSections.DISCORD}
                    >
                        Discord community
                    </SS.CallToAdventureSideNavLink>
                </S.CallToAdventureSubNavOptions>
            )}
        </S.CallToAdventureSubNav>
    );
};

export default CallToAdventureSubNav;
