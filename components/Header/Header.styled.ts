import styled from 'styled-components';

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

export const LogoLink = styled.a`
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

/** Primary nav */

export const PrimaryNav = styled.nav`
    display: flex;
    align-items: center;
    margin-left: 2.25rem;
    column-gap: 0.5rem;
`;

export const PrimaryNavItem = styled.a`
    padding: 0.75rem;
    font-family: ${({ theme }) => theme.typography.fonts.roboto.condensed.bold};
    font-size: 1.125rem;
    letter-spacing: 0.25px;
    font-style: italic;
    cursor: pointer;
`;

/** Sedondary nav */

export const SecondaryNav = styled.nav`
    display: flex;
    align-items: center;
    margin-left: auto;
`;

export const SecondaryNavItem = styled.div`
    display: flex;
    flex-shrink: 0;
    padding: 0.5rem;
    margin-left: 0.5rem;

    ${media.laptopS} {
        margin-left: 1rem;
    }
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

export const ThreeDotMenuItem = styled.a<ThreeDotMenuItemProps>`
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

export const ThreeDotMenuItemComingSoon = styled(Typography)`
    color: ${({ theme }) => theme.color.onDark.lowEmphasis};
`;
