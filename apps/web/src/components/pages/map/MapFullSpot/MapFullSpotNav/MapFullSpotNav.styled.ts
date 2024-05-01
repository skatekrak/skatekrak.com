import styled from 'styled-components';

import Typography from '@/components/Ui/typography/Typography';
import media from '@/styles/media';
import ArrowHead from '@/components/Ui/Icons/ArrowHead';

export const MapFullSpotNavContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 2rem 0 1.5rem;
    overflow-y: auto;

    ${media.tablet} {
        padding: 1.5rem 0 2rem;
    }
`;

export const MapFullSpotNavHeader = styled.div`
    margin: 0 1.5rem 1.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid ${({ theme }) => theme.color.onDark.divider};
`;

export const MapFullSpotName = styled(Typography)`
    margin-bottom: 1rem;
    max-width: 80%;
`;

export const MapFullSpotCity = styled(Typography)`
    margin-bottom: 0.25rem;
    font-family: ${({ theme }) => theme.typography.fonts.roboto.regular};
    text-transform: uppercase;

    & span {
        font-family: ${({ theme }) => theme.typography.fonts.roboto.bold};
    }
`;

export const MapFullSpotStreet = styled(Typography)`
    font-style: italic;
    font-family: ${({ theme }) => theme.typography.fonts.roboto.regular};
    color: ${({ theme }) => theme.color.onDark.mediumEmphasis};
`;

export const MapFullSpotExtra = styled.div`
    display: flex;
    align-items: center;
    margin-top: 1rem;

    & .map-icon {
        width: 3rem;
        margin-right: 1.5rem;
    }
`;

export const MapFullSpotNavMain = styled.nav`
    display: flex;

    ${media.tablet} {
        flex-grow: 1;
        flex-direction: column;
    }
`;

type MapFullSpotNavItemProps = {
    isActive: boolean;
};

export const MapFullSpotNavItem = styled.button<MapFullSpotNavItemProps>`
    display: flex;
    align-items: center;
    width: 50%;
    text-transform: uppercase;
    color: ${({ theme, isActive }) => (isActive ? theme.color.onDark.highEmphasis : theme.color.onDark.mediumEmphasis)};

    &:first-of-type {
        padding-left: 1.5rem;
    }

    &:last-of-type {
        padding-right: 1.5rem;
    }

    & svg {
        width: 1.5rem;
        fill: ${({ theme, isActive }) =>
            isActive ? theme.color.onDark.highEmphasis : theme.color.onDark.mediumEmphasis};
        transition: 0.1s;
    }

    &:hover {
        & svg {
            opacity: 1;
        }
    }

    ${media.tablet} {
        width: 100%;
        padding: 0.5rem 1.5rem;
    }
`;

export const MapFullSpotNavItemIcon = styled.div`
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 0.5rem;

    & svg {
        opacity: 1;
        margin-left: 0;
    }
`;

export const MapFullSpotNavItemText = styled(Typography)`
    letter-spacing: 0.03rem;

    ${media.tablet} {
        margin-right: auto;
        font-size: 1.125rem;
    }
`;

export const MapFullSpotNavItemArrow = styled(ArrowHead)<MapFullSpotNavItemProps>`
    margin-left: 0.5rem;
    transform: rotate(${({ isActive }) => (isActive ? '90deg' : '0deg')});

    ${media.tablet} {
        margin-left: 1rem;
        opacity: ${({ isActive }) => (isActive ? '1' : '0')};
        transform: rotate(0deg);
    }
`;
