import { useState } from 'react';
import {
    useFloating,
    offset,
    flip,
    shift,
    useClick,
    useDismiss,
    useInteractions,
    FloatingPortal,
} from '@floating-ui/react';

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

    const { refs, floatingStyles, context } = useFloating({
        open: isMenuOpen,
        onOpenChange: setIsMenuOpen,
        placement: 'bottom',
        middleware: [offset(4), flip(), shift()],
    });

    const click = useClick(context);
    const dismiss = useDismiss(context);
    const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

    return (
        <>
            <button ref={refs.setReference} className="flex flex-shrink-0 p-3" {...getReferenceProps()}>
                <IconDotsThreeVertical />
            </button>
            {isMenuOpen && (
                <FloatingPortal>
                    <div
                        ref={refs.setFloating}
                        style={floatingStyles}
                        {...getFloatingProps()}
                        className="min-width-[10rem] flex flex-col gap-2 mt-1 p-2 rounded bg-tertiary-dark border border-tertiary-medium box-shadow-onDark-highSharp z-[9999]"
                    >
                        <Link
                            className="block max-tablet:p-4 py-2 px-4 rounded hover:bg-tertiary-medium"
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://opencollective.com/opensb/projects/krakmap"
                        >
                            Support
                        </Link>

                        <Link
                            className="block max-tablet:p-4 py-2 px-4 rounded hover:bg-tertiary-medium"
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
                </FloatingPortal>
            )}
        </>
    );
};
