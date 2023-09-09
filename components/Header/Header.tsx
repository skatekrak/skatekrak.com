import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import Tippy from '@tippyjs/react/headless';

import IconDiscord from 'components/Ui/Icons/Logos/IconDiscord';
import IconTwitter from 'components/Ui/Icons/Logos/IconTwitter';
import IconYoutubeMonochrome from 'components/Ui/Icons/Logos/IconYoutubeMonochrome';
import IconDotsThreeVertical from 'components/Ui/Icons/IconDotsThreeVertical';
import IconUserCircle from 'components/Ui/Icons/IconUserCircle';
import Typography from 'components/Ui/typography/Typography';
import HeaderProfile from './HeaderProfile/HeaderProfile';
import * as S from './Header.styled';

import { PATH_CALL_TO_ADVENTURE } from 'pages/call-to-adventure';
import useSession from 'lib/hook/carrelage/use-session';
import { RootState } from 'store';
import IconInstagram from 'components/Ui/Icons/Logos/IconInstagram';
import { PATH_MEMBERSHIP } from 'pages/membership';

const Header: React.FC = () => {
    const isMobile = useSelector((state: RootState) => state.settings.isMobile);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const handleMenuOpen = () => setIsMenuOpen(!isMenuOpen);
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
                {!isMobile && (
                    <S.HeaderSentenceContainer>
                        <S.HeaderSentence component="condensedBody1">
                            powered by{' '}
                            <a href="https://www.opensb.org/" target="_blank" rel="noopener noreferrer">
                                OpenSB
                            </a>
                        </S.HeaderSentence>
                    </S.HeaderSentenceContainer>
                )}
                <S.SecondaryNav>
                    {!isMobile && (
                        <div>
                            <Link href={PATH_CALL_TO_ADVENTURE}>
                                <S.SecondaryNavItem>Call to Adventure</S.SecondaryNavItem>
                            </Link>
                            <Link href={PATH_MEMBERSHIP}>
                                <S.SecondaryNavItem>Membership</S.SecondaryNavItem>
                            </Link>
                        </div>
                    )}
                    {isMobile && (
                        <S.SecondaryNavIcon
                            as="a"
                            target="_blank"
                            href="https://discord.gg/exMAqSuVfj"
                            rel="noreferrer"
                        >
                            <IconDiscord />
                        </S.SecondaryNavIcon>
                    )}
                    {!isMobile && (
                        <>
                            <S.SecondaryNavSocialIcon
                                as="a"
                                target="_blank"
                                href="https://discord.gg/exMAqSuVfj"
                                rel="noreferrer"
                            >
                                <IconDiscord />
                            </S.SecondaryNavSocialIcon>
                            <S.SecondaryNavIconSeparator />
                            <S.SecondaryNavSocialIcon
                                as="a"
                                target="_blank"
                                href="https://www.twitter.com/skatekrak"
                                rel="noreferrer"
                            >
                                <IconTwitter />
                            </S.SecondaryNavSocialIcon>
                            <S.SecondaryNavIconSeparator />
                            <S.SecondaryNavSocialIcon
                                as="a"
                                target="_blank"
                                href="https://www.youtube.com/krakskate"
                                rel="noreferrer"
                            >
                                <IconYoutubeMonochrome />
                            </S.SecondaryNavSocialIcon>
                            <S.SecondaryNavIconSeparator />
                            <S.SecondaryNavSocialIcon
                                as="a"
                                target="_blank"
                                href="https://www.instagram.com/skate_krak"
                                rel="noreferrer"
                            >
                                <IconInstagram />
                            </S.SecondaryNavSocialIcon>
                        </>
                    )}

                    {/* Three dot menu */}
                    <Tippy
                        visible={isMenuOpen}
                        onClickOutside={handleMenuOpen}
                        interactive
                        placement="bottom"
                        render={() => (
                            <S.ThreeDotMenu>
                                {isMobile && (
                                    <>
                                        <S.ThreeDotMenuItem href={PATH_MEMBERSHIP}>
                                            <Typography as="span" component="body1">
                                                Membership
                                            </Typography>
                                        </S.ThreeDotMenuItem>

                                        <S.ThreeDotMenuItem href={PATH_CALL_TO_ADVENTURE}>
                                            <Typography as="span" component="body1">
                                                Call to Adventure
                                            </Typography>
                                        </S.ThreeDotMenuItem>
                                    </>
                                )}

                                <S.ThreeDotMenuItem href="/mag">
                                    <Typography as="span" component="body1">
                                        Mag
                                    </Typography>
                                </S.ThreeDotMenuItem>

                                <S.ThreeDotMenuItem href="/video">
                                    <Typography as="span" component="body1">
                                        Video
                                    </Typography>
                                </S.ThreeDotMenuItem>

                                <S.ThreeDotMenuItem href="/news">
                                    <Typography as="span" component="body1">
                                        News
                                    </Typography>
                                </S.ThreeDotMenuItem>

                                {isMobile && (
                                    <S.ThreeDotMenuSocialContainer>
                                        <Link
                                            href="https://www.twitter.com/skatekrak"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <S.SecondaryNavSocialIcon>
                                                <IconTwitter />
                                            </S.SecondaryNavSocialIcon>
                                        </Link>
                                        <S.SecondaryNavIconSeparator />
                                        <Link
                                            href="https://www.youtube.com/krakskate"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <S.SecondaryNavSocialIcon>
                                                <IconYoutubeMonochrome />
                                            </S.SecondaryNavSocialIcon>
                                        </Link>
                                        <S.SecondaryNavIconSeparator />
                                        <Link
                                            href="https://www.instagram.com/skate_krak"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <S.SecondaryNavSocialIcon>
                                                <IconInstagram />
                                            </S.SecondaryNavSocialIcon>
                                        </Link>
                                    </S.ThreeDotMenuSocialContainer>
                                )}
                            </S.ThreeDotMenu>
                        )}
                    >
                        <S.SecondaryNavIcon as="button" onClick={handleMenuOpen}>
                            <IconDotsThreeVertical />
                        </S.SecondaryNavIcon>
                    </Tippy>

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
