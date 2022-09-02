import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import Tippy from '@tippyjs/react/headless';

import IconDiscord from 'components/Ui/Icons/Logos/IconDiscord';
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
                                            <S.ThreeDotMenuItem large>
                                                <Typography as="span" component="subtitle1">
                                                    Call To Adventure
                                                </Typography>
                                            </S.ThreeDotMenuItem>
                                        </Link>
                                    )}
                                    <Link href="" passHref>
                                        <S.ThreeDotMenuItem large disabled>
                                            <Typography as="span" component="subtitle1">
                                                Roadmap
                                            </Typography>
                                            <S.ThreeDotMenuItemComingSoon component="caption">
                                                Coming Soon
                                            </S.ThreeDotMenuItemComingSoon>
                                        </S.ThreeDotMenuItem>
                                    </Link>

                                    <S.ThreeDotMenuTitle component="subtitle2">Find us</S.ThreeDotMenuTitle>
                                    <S.ThreeDotMenuItem
                                        href="https://www.twitter.com/skatekrak"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <Typography as="span" component="subtitle2">
                                            Twitter
                                        </Typography>
                                    </S.ThreeDotMenuItem>
                                    <S.ThreeDotMenuItem
                                        href="https://www.youtube.com/krakskate"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <Typography as="span" component="subtitle2">
                                            Youtube
                                        </Typography>
                                    </S.ThreeDotMenuItem>

                                    <S.ThreeDotMenuTitle component="subtitle2">Others</S.ThreeDotMenuTitle>
                                    <Link href="/mag" passHref>
                                        <S.ThreeDotMenuItem>
                                            <Typography as="span" component="body2">
                                                Mag
                                            </Typography>
                                        </S.ThreeDotMenuItem>
                                    </Link>
                                    <Link href="/video" passHref>
                                        <S.ThreeDotMenuItem>
                                            <Typography as="span" component="body2">
                                                Video
                                            </Typography>
                                        </S.ThreeDotMenuItem>
                                    </Link>
                                    <Link href="/news" passHref>
                                        <S.ThreeDotMenuItem href="#">
                                            <Typography as="span" component="body2">
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
