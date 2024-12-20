import React from 'react';
import Link from 'next/link';

import IconDiscord from '@/components/Ui/Icons/Logos/IconDiscord';
import IconTwitter from '@/components/Ui/Icons/Logos/IconTwitter';
import IconYoutubeMonochrome from '@/components/Ui/Icons/Logos/IconYoutubeMonochrome';
import IconUserCircle from '@/components/Ui/Icons/IconUserCircle';
import HeaderProfile from './HeaderProfile/HeaderProfile';
import * as S from './Header.styled';

import useSession from '@/lib/hook/carrelage/use-session';
import IconInstagram from '@/components/Ui/Icons/Logos/IconInstagram';
import { HeaderThreeDotsMenu } from './HeaderThreeDotsMenu';

const Header: React.FC = () => {
    const { data: sessionData } = useSession();
    const isConnected = sessionData != null;

    return (
        <S.Container>
            <S.TopContainer>
                <Link href="/">
                    <S.LogoLink>
                        <S.KrakLogo title="Home page" />
                    </S.LogoLink>
                </Link>
                <S.HeaderSentenceContainer className="hidden md:block">
                    <S.HeaderSentence component="condensedBody1">
                        free skateboarding archives built & run by skateboarders; part of{' '}
                        <a className="mr-1" href="https://www.opensb.org/" target="_blank" rel="noopener noreferrer">
                            OpenSB
                        </a>
                        -- support the project by donating to our{' '}
                        <a
                            className="mr-1.5"
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://opencollective.com/opensb/projects/krakmap"
                        >
                            open collective
                        </a>{' '}
                        🙏
                    </S.HeaderSentence>
                </S.HeaderSentenceContainer>

                <S.SecondaryNav className="gap-4">
                    <div className="hidden md:flex items-center">
                        <div className="ml-5 flex items-center">
                            <S.SecondaryNavSocialIcon
                                target="_blank"
                                href="https://discord.gg/exMAqSuVfj"
                                rel="noreferrer"
                            >
                                <IconDiscord className="size-5" />
                            </S.SecondaryNavSocialIcon>
                            <S.SecondaryNavIconSeparator />
                            <S.SecondaryNavSocialIcon
                                target="_blank"
                                href="https://www.twitter.com/skatekrak"
                                rel="noreferrer"
                            >
                                <IconTwitter className="size-5" />
                            </S.SecondaryNavSocialIcon>
                            <S.SecondaryNavIconSeparator />
                            <S.SecondaryNavSocialIcon
                                target="_blank"
                                href="https://www.youtube.com/krakskate"
                                rel="noreferrer"
                            >
                                <IconYoutubeMonochrome className="size-5" />
                            </S.SecondaryNavSocialIcon>
                            <S.SecondaryNavIconSeparator />
                            <S.SecondaryNavSocialIcon
                                target="_blank"
                                href="https://www.instagram.com/skate_krak"
                                rel="noreferrer"
                            >
                                <IconInstagram className="size-5" />
                            </S.SecondaryNavSocialIcon>
                        </div>
                    </div>

                    <S.SecondaryNavIconLink
                        className="md:hidden"
                        target="_blank"
                        href="https://discord.gg/exMAqSuVfj"
                        rel="noreferrer"
                    >
                        <IconDiscord />
                    </S.SecondaryNavIconLink>

                    <HeaderThreeDotsMenu />

                    {isConnected ? (
                        <HeaderProfile />
                    ) : (
                        <Link href="/auth/login">
                            <S.SecondaryNavIcon>
                                <IconUserCircle />
                            </S.SecondaryNavIcon>
                        </Link>
                    )}
                </S.SecondaryNav>
            </S.TopContainer>
        </S.Container>
    );
};

export default Header;
