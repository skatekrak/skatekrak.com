import styled from 'styled-components';

import KrakLogoHand from 'components/Ui/branding/KrakLogoHand';
import Typography from 'components/Ui/typography/Typography';

export const Container = styled.header`
    display: flex;
    flex-direction: column;
    padding: 0.625rem 2rem;
    background-color: ${({ theme }) => theme.color.tertiary.dark};
    box-shadow: ${({ theme }) => theme.shadow.onDark.highSharp};
    z-index: 2;
`;

export const TopContainer = styled.div`
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

export const Nav = styled.nav`
    display: flex;
    align-items: center;
    margin-left: auto;
`;

export const NavItem = styled.div`
    display: flex;
    padding: 0.5rem;
    margin-left: 0.5rem;
`;

/* Secondary Nav */
export const SecondaryNav = styled.div`
    min-width: 10rem;
    padding: 0.375rem 0;
    border-radius: 0.25rem;
    background-color: ${({ theme }) => theme.color.tertiary.dark};
    border: 1px solid ${({ theme }) => theme.color.tertiary.medium};
    box-shadow: ${({ theme }) => theme.shadow.onDark.highSharp};
`;

export const SecondaryNavTitle = styled(Typography)`
    padding: 0.375rem 1rem;
    color: ${({ theme }) => theme.color.onDark.lowEmphasis};
`;

export const SecondaryNavItem = styled.a`
    display: block;
    padding: 0.375rem 1rem;

    &:hover {
        background-color: ${({ theme }) => theme.color.tertiary.medium};
    }
`;
