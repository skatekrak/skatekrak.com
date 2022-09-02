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
                    <S.PrimaryNav>
                        <Link href="/">
                            <S.PrimaryNavItem>Map</S.PrimaryNavItem>
                        </Link>
                        <Link href={PATH_CALL_TO_ADVENTURE}>
                            <S.PrimaryNavItem>Call to Adventure</S.PrimaryNavItem>
                        </Link>
                    </S.PrimaryNav>
                )}
                <S.SecondaryNav>
                    <S.SecondaryNavItem as="a" target="_blank" href="https://discord.gg/exMAqSuVfj" rel="noreferrer">
                        <IconDiscord />
                    </S.SecondaryNavItem>
                    <S.SecondaryNavItem
                        as="a"
                        target="_blank"
                        href="https://www.twitter.com/skatekrak"
                        rel="noreferrer"
                    >
                        <IconTwitter />
                    </S.SecondaryNavItem>
                    <S.SecondaryNavItem
                        as="a"
                        target="_blank"
                        href="https://www.youtube.com/krakskate"
                        rel="noreferrer"
                    >
                        <IconYoutubeMonochrome />
                    </S.SecondaryNavItem>

                    {/* Three dot menu */}
                    <div>
                        <Tippy
                            visible={isMenuOpen}
                            onClickOutside={handleMenuOpen}
                            interactive
                            placement="bottom"
                            render={() => (
                                <S.ThreeDotMenu>
                                    {isMobile && (
                                        <Link href={PATH_CALL_TO_ADVENTURE} passHref>
                                            <S.ThreeDotMenuItem>
                                                <Typography as="span" component="body1">
                                                    Call To Adventure
                                                </Typography>
                                            </S.ThreeDotMenuItem>
                                        </Link>
                                    )}
                                    <Link href="" passHref>
                                        <S.ThreeDotMenuItem disabled>
                                            <Typography as="span" component="body1">
                                                Roadmap
                                            </Typography>
                                            <S.ThreeDotMenuItemComingSoon component="caption">
                                                Coming Soon
                                            </S.ThreeDotMenuItemComingSoon>
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
                                </S.ThreeDotMenu>
                            )}
                        >
                            <S.SecondaryNavItem as="button" onClick={handleMenuOpen}>
                                <IconDotsThreeVertical />
                            </S.SecondaryNavItem>
                        </Tippy>
                    </div>

                    {isConnected ? (
                        <HeaderProfile />
                    ) : (
                        <Link href="/auth/login" passHref>
                            <S.SecondaryNavItem as="a">
                                <IconUserCircle />
                            </S.SecondaryNavItem>
                        </Link>
                    )}
                </S.SecondaryNav>
            </S.TopContainer>
        </S.Container>
    );
};

export default Header;
