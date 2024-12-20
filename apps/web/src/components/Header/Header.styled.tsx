import styled from 'styled-components';
import Link from 'next/link';

import KrakLogoHand from '@/components/Ui/branding/KrakLogoHand';
import Typography from '@/components/Ui/typography/Typography';

import media from '@/styles/media';
import { TailwindElementFactory } from '@/styles/tailwind-helpers';

export const Container = TailwindElementFactory('header', {
    className:
        'flex flex-shrink-0 flex-col py-[0.625rem] px-8 md:px-5 bg-tertiary-dark box-shadow-onDark-highSharp z-index-2',
});

export const TopContainer = TailwindElementFactory('div', {
    className: 'flex flex-shrink items-center justify-between',
});

export const LogoLink = TailwindElementFactory('span', { className: 'flex' });

export const KrakLogo = styled(KrakLogoHand)`
    height: 2.75rem;
    fill: ${({ theme }) => theme.color.onDark.highEmphasis};

    & .krak-logo-hand-shape {
        stroke: red;
        stroke-width: 1px;
    }
`;

/** Middle sentence */
export const HeaderSentenceContainer = styled.div`
    display: none;
    position: relative;
    margin: 0 1.5rem;

    ${media.laptopS} {
        display: block;
    }
`;

export const HeaderSentence = styled(Typography)`
    font-style: italic;
    letter-spacing: 0.03rem;
    overflow: visible;

    & a {
        text-decoration: underline;
    }
`;

/** Sedondary nav */
export const SecondaryNav = TailwindElementFactory('nav', { className: 'flex items-center ml-auto' });

export const SecondaryNavItem = styled.span`
    padding: 0.75rem;
    font-family: ${({ theme }) => theme.typography.fonts.roboto.condensed.bold};
    font-size: 1.125rem;
    letter-spacing: 0.25px;
    cursor: pointer;
`;

export const SecondaryNavIcon = TailwindElementFactory('div', { className: 'flex flex-shrink-0 p-3' });
export const SecondaryNavIconLink = TailwindElementFactory('a', { className: 'flex flex-shrink-0 p-3' });
export const SecondaryNavIconButton = TailwindElementFactory('button', { className: 'flex flex-shrink-0 p-3' });

export const SecondaryNavSocialIcon = TailwindElementFactory('a', {
    className: 'flex flex-shrink-0 p-1 rounded-full hover:bg-onDark-divider',
});

export const SecondaryNavIconSeparator = TailwindElementFactory('div', {
    className: 'h-4 w-[1px] mx-2 bg-onDark-lowEmphasis rotate-[33deg]',
});

/** Three dot menu */
export const ThreeDotMenu = TailwindElementFactory('div', {
    className:
        'min-width-[10rem] px-[0.375rem] bg-tertiary-dark border border-tertiary-medium box-shadow-onDark-highSharp',
});

export const ThreeDotMenuTitle = styled(Typography)`
    padding: 0.375rem 1rem;
    color: ${({ theme }) => theme.color.onDark.lowEmphasis};
`;

type ThreeDotMenuItemProps = {
    disabled?: boolean;
};

export const ThreeDotMenuItem = styled(Link)<ThreeDotMenuItemProps>`
    display: block;
    padding: 0.5rem 1rem;
    ${({ theme, disabled }) =>
        disabled && {
            color: theme.color.onDark.mediumEmphasis,
            cursor: 'default',
        }}

    &:hover {
        ${({ theme, disabled }) =>
            !disabled && {
                backgroundColor: theme.color.tertiary.medium,
            }}
    }
`;

export const ThreeDotMenuSocialContainer = TailwindElementFactory('div', {
    className: 'flex items-center justify-between pt-2 px-3 pb-1',
});
