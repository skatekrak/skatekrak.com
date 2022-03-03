import React, { useState } from 'react';
import Link from 'next/link';
import Tippy from '@tippyjs/react/headless';

import IconDiscord from 'components/Ui/Icons/Logos/IconDiscord';
import IconDotsThreeVertical from 'components/Ui/Icons/IconDotsThreeVertical';
import IconUserCircle from 'components/Ui/Icons/IconUserCircle';
import * as S from './Header.styled';
import Typography from 'components/Ui/typography/Typography';

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const handleMenuOpen = () => setIsMenuOpen(!isMenuOpen);

    const isConnected = false;

    return (
        <S.Container>
            <S.TopContainer>
                <Link href="/" passHref>
                    <S.LogoLink>
                        <S.KrakLogo title="Home page" />
                    </S.LogoLink>
                </Link>
                <S.Nav>
                    <S.NavItem as="a" href="#">
                        <IconDiscord />
                    </S.NavItem>

                    {/* Secondary nav */}
                    <div>
                        <Tippy
                            visible={isMenuOpen}
                            onClickOutside={handleMenuOpen}
                            interactive
                            placement="bottom"
                            render={() => (
                                <S.SecondaryNav>
                                    <S.SecondaryNavTitle component="subtitle2">Download the app</S.SecondaryNavTitle>
                                    <S.SecondaryNavItem
                                        href="https://itunes.apple.com/us/app/krak/id916474561"
                                        target="_blank"
                                        rel="noreferrer noopener"
                                    >
                                        <Typography as="span" component="subtitle2">
                                            iOS
                                        </Typography>
                                    </S.SecondaryNavItem>

                                    <S.SecondaryNavTitle component="subtitle2">Find us</S.SecondaryNavTitle>
                                    <S.SecondaryNavItem
                                        href="https://www.instagram.com/skate_krak/"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <Typography as="span" component="subtitle2">
                                            Instagram
                                        </Typography>
                                    </S.SecondaryNavItem>
                                    <S.SecondaryNavItem
                                        href="https://www.youtube.com/krakskate"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <Typography as="span" component="subtitle2">
                                            Youtube
                                        </Typography>
                                    </S.SecondaryNavItem>

                                    <S.SecondaryNavTitle component="subtitle2">Others</S.SecondaryNavTitle>
                                    <Link href="/mag" passHref>
                                        <S.SecondaryNavItem>
                                            <Typography as="span" component="body2">
                                                Mag
                                            </Typography>
                                        </S.SecondaryNavItem>
                                    </Link>
                                    <Link href="/video" passHref>
                                        <S.SecondaryNavItem>
                                            <Typography as="span" component="body2">
                                                Video
                                            </Typography>
                                        </S.SecondaryNavItem>
                                    </Link>
                                    <Link href="/news" passHref>
                                        <S.SecondaryNavItem href="#">
                                            <Typography as="span" component="body2">
                                                News
                                            </Typography>
                                        </S.SecondaryNavItem>
                                    </Link>
                                </S.SecondaryNav>
                            )}
                        >
                            <S.NavItem as="button" onClick={handleMenuOpen}>
                                <IconDotsThreeVertical />
                            </S.NavItem>
                        </Tippy>
                    </div>

                    {isConnected ? (
                        <S.NavItem as="button">
                            <IconUserCircle />
                        </S.NavItem>
                    ) : (
                        <Link href="/auth/login" passHref>
                            <S.NavItem as="a">
                                <IconUserCircle />
                            </S.NavItem>
                        </Link>
                    )}
                </S.Nav>
            </S.TopContainer>
        </S.Container>
    );
};

export default Header;
