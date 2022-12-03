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
import { PATH_ROADMAP } from 'pages/roadmap';
import useSession from 'lib/hook/carrelage/use-session';
import { RootState } from 'store';
import IconInstagram from 'components/Ui/Icons/Logos/IconInstagram';

const Header: React.FC = () => {
    const isMobile = useSelector((state: RootState) => state.settings.isMobile);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const handleMenuOpen = () => setIsMenuOpen(!isMenuOpen);
    const { data: sessionData } = useSession();
    const isConnected = sessionData != null;

    return (
        <S.Container>
            <S.TopContainer>
                <Link href="/" passHref>
                    <S.LogoLink>
                        <S.KrakLogo title="Home page" />
                    </S.LogoLink>
                </Link>
                {!isMobile && (
                    <S.HeaderSentence component="condensedBody1">The first skateboarding metalabel</S.HeaderSentence>
                )}
                <S.SecondaryNav>
                    {!isMobile && (
                        <div>
                            <Link href={PATH_CALL_TO_ADVENTURE}>
                                <S.SecondaryNavItem>Call to Adventure</S.SecondaryNavItem>
                            </Link>
                            <S.SecondaryNavItem
                                href="https://skatekrak.com/join"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Membership
                            </S.SecondaryNavItem>
                        </div>
                    )}
                    <S.SecondaryNavIcon as="a" target="_blank" href="https://discord.gg/exMAqSuVfj" rel="noreferrer">
                        <IconDiscord />
                    </S.SecondaryNavIcon>
                    {!isMobile && (
                        <>
                            <S.SecondaryNavIcon
                                as="a"
                                target="_blank"
                                href="https://www.twitter.com/skatekrak"
                                rel="noreferrer"
                            >
                                <IconTwitter />
                            </S.SecondaryNavIcon>
                            <S.SecondaryNavIcon
                                as="a"
                                target="_blank"
                                href="https://www.youtube.com/krakskate"
                                rel="noreferrer"
                            >
                                <IconYoutubeMonochrome />
                            </S.SecondaryNavIcon>
                            <S.SecondaryNavIcon
                                as="a"
                                target="_blank"
                                href="https://www.instagram.com/skate_krak"
                                rel="noreferrer"
                            >
                                <IconInstagram />
                            </S.SecondaryNavIcon>
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
                                        <Link href="https://skatekrak.com/join" passHref>
                                            <S.ThreeDotMenuItem target="_blank" rel="noopener noreferrer">
                                                <Typography as="span" component="body1">
                                                    Membership
                                                </Typography>
                                            </S.ThreeDotMenuItem>
                                        </Link>
                                        <Link href={PATH_CALL_TO_ADVENTURE} passHref>
                                            <S.ThreeDotMenuItem>
                                                <Typography as="span" component="body1">
                                                    Call to Adventure
                                                </Typography>
                                            </S.ThreeDotMenuItem>
                                        </Link>
                                    </>
                                )}
                                <Link href={PATH_ROADMAP} passHref>
                                    <S.ThreeDotMenuItem>
                                        <Typography as="span" component="body1">
                                            Roadmap
                                        </Typography>
                                    </S.ThreeDotMenuItem>
                                </Link>

                                <Link href="/mag" passHref>
                                    <S.ThreeDotMenuItem>
                                        <Typography as="span" component="body1">
                                            Mag
                                        </Typography>
                                    </S.ThreeDotMenuItem>
                                </Link>
                                <Link href="/video" passHref>
                                    <S.ThreeDotMenuItem>
                                        <Typography as="span" component="body1">
                                            Video
                                        </Typography>
                                    </S.ThreeDotMenuItem>
                                </Link>
                                <Link href="/news" passHref>
                                    <S.ThreeDotMenuItem href="#">
                                        <Typography as="span" component="body1">
                                            News
                                        </Typography>
                                    </S.ThreeDotMenuItem>
                                </Link>
                                {isMobile && (
                                    <>
                                        <Link href="https://www.twitter.com/skatekrak" passHref>
                                            <S.ThreeDotMenuItem target="_blank" rel="noopener noreferrer">
                                                <Typography as="span" component="body1">
                                                    Twitter
                                                </Typography>
                                            </S.ThreeDotMenuItem>
                                        </Link>
                                        <Link href="https://www.youtube.com/krakskate" passHref>
                                            <S.ThreeDotMenuItem target="_blank" rel="noopener noreferrer">
                                                <Typography as="span" component="body1">
                                                    Youtube
                                                </Typography>
                                            </S.ThreeDotMenuItem>
                                        </Link>
                                        <Link href="https://www.instagram.com/skate_krak" passHref>
                                            <S.ThreeDotMenuItem target="_blank" rel="noopener noreferrer">
                                                <Typography as="span" component="body1">
                                                    Instagram
                                                </Typography>
                                            </S.ThreeDotMenuItem>
                                        </Link>
                                    </>
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
                        <Link href="/auth/login" passHref>
                            <S.SecondaryNavIcon as="a">
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
