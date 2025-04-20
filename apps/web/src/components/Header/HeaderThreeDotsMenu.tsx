import { useState } from 'react';
import Tippy from '@tippyjs/react/headless';

import IconDotsThreeVertical from '@/components/Ui/Icons/IconDotsThreeVertical';
import { PATH_CALL_TO_ADVENTURE } from '@/pages/call-to-adventure';
import IconTwitter from '@/components/Ui/Icons/Logos/IconTwitter';
import IconInstagram from '@/components/Ui/Icons/Logos/IconInstagram';
import IconYoutubeMonochrome from '@/components/Ui/Icons/Logos/IconYoutubeMonochrome';
import { useSettingsStore } from '@/store/settings';
import { NavSocialIconLink, NavSocialIconSeparator } from '@/components/Header/components';
import Link from 'next/link';

export const HeaderThreeDotsMenu = () => {
    const isMobile = useSettingsStore((state) => state.isMobile);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const handleMenuOpen = () => setIsMenuOpen((prev) => !prev);

    return (
        <Tippy
            visible={isMenuOpen}
            onClickOutside={handleMenuOpen}
            interactive
            placement="bottom"
            render={() => (
                <div className="min-width-[10rem] flex flex-col gap-2 mt-1 p-2 rounded bg-tertiary-dark border border-tertiary-medium box-shadow-onDark-highSharp">
                    <Link
                        className="block max-md:p-4 py-2 px-4 rounded hover:bg-tertiary-medium"
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://opencollective.com/opensb/projects/krakmap"
                    >
                        Support
                    </Link>

                    <Link
                        className="block max-md:p-4 py-2 px-4 rounded hover:bg-tertiary-medium"
                        href={PATH_CALL_TO_ADVENTURE}
                    >
                        Call to Adventure
                    </Link>
                    {isMobile && (
                        <div className="flex items-center justify-between pt-2 px-3 pb-1">
                            <NavSocialIconLink
                                href="https://www.twitter.com/skatekrak"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <IconTwitter />
                            </NavSocialIconLink>
                            <NavSocialIconSeparator />
                            <NavSocialIconLink
                                href="https://www.youtube.com/krakskate"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <IconYoutubeMonochrome />
                            </NavSocialIconLink>
                            <NavSocialIconSeparator />
                            <NavSocialIconLink
                                href="https://www.instagram.com/skate_krak"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <IconInstagram />
                            </NavSocialIconLink>
                        </div>
                    )}
                </div>
            )}
        >
            <button className="flex flex-shrink-0 p-3" onClick={handleMenuOpen}>
                <IconDotsThreeVertical />
            </button>
        </Tippy>
    );
};
