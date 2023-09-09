import styled from 'styled-components';
import Link from 'next/link';

import KrakLogoHand from 'components/Ui/branding/KrakLogoHand';
import Typography from 'components/Ui/typography/Typography';

import media from 'styles/media';

export const Container = styled.header`
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    padding: 0.625rem 1.25rem;
    background-color: ${({ theme }) => theme.color.tertiary.dark};
    box-shadow: ${({ theme }) => theme.shadow.onDark.highSharp};
    z-index: 2;

    ${media.mobile} {
        padding: 0.625rem 2rem;
    }
`;

export const TopContainer = styled.div`
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

export const LogoLink = styled.span`
    display: flex;
`;

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
    text-align: center;
    letter-spacing: 0.03rem;
    overflow: visible;

    & a {
        text-decoration: underline;
    }
`;

/** Sedondary nav */

export const SecondaryNav = styled.nav`
    display: flex;
    align-items: center;
    margin-left: auto;
`;

export const SecondaryNavItem = styled.span`
    margin-right: 1rem;
    padding: 0.75rem;
    font-family: ${({ theme }) => theme.typography.fonts.roboto.condensed.bold};
    font-size: 1.125rem;
    letter-spacing: 0.25px;
    cursor: pointer;

    &:last-of-type {
        margin-right: 1.5rem;
    }
`;

export const SecondaryNavIcon = styled.div`
    display: flex;
    flex-shrink: 0;
    padding: 0.5rem;
    margin-left: 0.5rem;

    ${media.laptopS} {
        margin-left: 1rem;
    }

    &:first-child {
        margin-left: 0;
    }
`;

export const SecondaryNavSocialIcon = styled.div`
    display: flex;
    flex-shrink: 0;
    padding: 0.25rem;
    border-radius: 100%;

    &:hover {
        background-color: ${({ theme }) => theme.color.onDark.divider};
    }

    & svg {
        width: 1.25rem;
        height: 1.25rem;
    }
`;

export const SecondaryNavIconSeparator = styled.div`
    height: 1rem;
    width: 1px;
    margin: 0 0.625rem;
    background-color: ${({ theme }) => theme.color.onDark.lowEmphasis};
    transform: rotate(33deg);
`;

/** Three dot menu */
export const ThreeDotMenu = styled.div`
    min-width: 10rem;
    padding: 0.375rem 0;
    border-radius: 0.25rem;
    background-color: ${({ theme }) => theme.color.tertiary.dark};
    border: 1px solid ${({ theme }) => theme.color.tertiary.medium};
    box-shadow: ${({ theme }) => theme.shadow.onDark.highSharp};
`;

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

export const ThreeDotMenuSocialContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.75rem 0.25rem;
`;
