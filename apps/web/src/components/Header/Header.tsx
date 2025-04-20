import React from 'react';
import Link from 'next/link';

import IconDiscord from '@/components/Ui/Icons/Logos/IconDiscord';
import IconTwitter from '@/components/Ui/Icons/Logos/IconTwitter';
import IconYoutubeMonochrome from '@/components/Ui/Icons/Logos/IconYoutubeMonochrome';
import IconUserCircle from '@/components/Ui/Icons/IconUserCircle';
import HeaderProfile from './HeaderProfile';

import useSession from '@/lib/hook/carrelage/use-session';
import IconInstagram from '@/components/Ui/Icons/Logos/IconInstagram';
import { HeaderThreeDotsMenu } from './HeaderThreeDotsMenu';
import Typography from '@/components/Ui/typography/Typography';
import { NavSocialIconLink, NavSocialIconSeparator } from '@/components/Header/components';
import KrakLogoHand from '@/components/Ui/branding/KrakLogoHand';

const Header: React.FC = () => {
    const { data: sessionData } = useSession();
    const isConnected = sessionData != null;

    return (
        <header className="flex flex-shrink-0 flex-col py-[0.625rem] px-8 md:px-5 bg-tertiary-dark box-shadow-onDark-highSharp z-index-2">
            <div className="flex flex-shrink items-center justify-between">
                <Link href="/">
                    <KrakLogoHand className="h-11 fill-onDark-highEmphasis [&>.krak-logo-hand-shape]:stroke-red-600" />
                </Link>
                <div className="hidden md:block relative mx-6">
                    <Typography component="condensedBody1" className="italic [&>a]:underline">
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
                    </Typography>
                </div>

                <nav className="flex items-center gap-4 ml-auto shrink-0">
                    <div className="hidden md:flex items-center">
                        <div className="ml-5 flex items-center">
                            <NavSocialIconLink target="_blank" href="https://discord.gg/exMAqSuVfj" rel="noreferrer">
                                <IconDiscord className="size-5" />
                            </NavSocialIconLink>
                            <NavSocialIconSeparator />
                            <NavSocialIconLink
                                target="_blank"
                                href="https://www.twitter.com/skatekrak"
                                rel="noreferrer"
                            >
                                <IconTwitter className="size-5" />
                            </NavSocialIconLink>
                            <NavSocialIconSeparator />
                            <NavSocialIconLink
                                target="_blank"
                                href="https://www.youtube.com/krakskate"
                                rel="noreferrer"
                            >
                                <IconYoutubeMonochrome className="size-5" />
                            </NavSocialIconLink>
                            <NavSocialIconSeparator />
                            <NavSocialIconLink
                                target="_blank"
                                href="https://www.instagram.com/skate_krak"
                                rel="noreferrer"
                            >
                                <IconInstagram className="size-5" />
                            </NavSocialIconLink>
                        </div>
                    </div>

                    <NavSocialIconLink
                        className="mr-4 md:hidden"
                        target="_blank"
                        href="https://discord.gg/exMAqSuVfj"
                        rel="noreferrer"
                    >
                        <IconDiscord />
                    </NavSocialIconLink>

                    <HeaderThreeDotsMenu />

                    {isConnected ? (
                        <HeaderProfile />
                    ) : (
                        <Link href="/auth/login">
                            <div className="flex flex-shrink-0 p-3">
                                <IconUserCircle />
                            </div>
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
