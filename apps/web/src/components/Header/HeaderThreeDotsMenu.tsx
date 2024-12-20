import { useState } from 'react';
import Tippy from '@tippyjs/react/headless';

import * as S from './Header.styled';
import IconDotsThreeVertical from '@/components/Ui/Icons/IconDotsThreeVertical';
import Typography from '@/components/Ui/typography/Typography';
import { PATH_CALL_TO_ADVENTURE } from '@/pages/call-to-adventure';
import IconTwitter from '@/components/Ui/Icons/Logos/IconTwitter';
import IconInstagram from '@/components/Ui/Icons/Logos/IconInstagram';
import IconYoutubeMonochrome from '@/components/Ui/Icons/Logos/IconYoutubeMonochrome';
import { useSettingsStore } from '@/store/settings';

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
                <S.ThreeDotMenu>
                    <S.ThreeDotMenuItem
                        target="_bank"
                        rel="noopener noreferrer"
                        href="https://opencollective.com/opensb/projects/krakmap"
                    >
                        <Typography as="span" component="body1">
                            Support
                        </Typography>
                    </S.ThreeDotMenuItem>

                    <S.ThreeDotMenuItem href={PATH_CALL_TO_ADVENTURE}>
                        <Typography as="span" component="body1">
                            Call to Adventure
                        </Typography>
                    </S.ThreeDotMenuItem>
                    {isMobile && (
                        <S.ThreeDotMenuSocialContainer>
                            <S.SecondaryNavSocialIcon
                                href="https://www.twitter.com/skatekrak"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <IconTwitter />
                            </S.SecondaryNavSocialIcon>
                            <S.SecondaryNavIconSeparator />
                            <S.SecondaryNavSocialIcon
                                href="https://www.youtube.com/krakskate"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <IconYoutubeMonochrome />
                            </S.SecondaryNavSocialIcon>
                            <S.SecondaryNavIconSeparator />
                            <S.SecondaryNavSocialIcon
                                href="https://www.instagram.com/skate_krak"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <IconInstagram />
                            </S.SecondaryNavSocialIcon>
                        </S.ThreeDotMenuSocialContainer>
                    )}
                </S.ThreeDotMenu>
            )}
        >
            <S.SecondaryNavIconButton onClick={handleMenuOpen}>
                <IconDotsThreeVertical />
            </S.SecondaryNavIconButton>
        </Tippy>
    );
};
