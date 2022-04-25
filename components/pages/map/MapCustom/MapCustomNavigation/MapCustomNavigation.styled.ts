import styled from 'styled-components';

import Typography from 'components/Ui/typography/Typography';

import media from 'styles/media';

export const MapCustomNavigation = styled.div`
    position: absolute;
    top: 1rem;
    right: 1rem;
    left: 1rem;
    display: flex;
    flex-direction: column;
    min-width: 20rem;
    color: ${({ theme }) => theme.color.onDark.highEmphasis};
    background-color: ${({ theme }) => theme.color.tertiary.dark};
    border: 1.5px solid ${({ theme }) => theme.color.tertiary.medium};
    border-radius: 0.25rem;
    box-shadow: ${({ theme }) => theme.shadow.onDark.highSharp};
    z-index: 1000;

    & .divider-vertical {
        height: 1.5rem;
    }

    ${media.mobile} {
        right: inherit;
        min-width: 24rem;
    }

    ${media.tablet} {
        flex-direction: row;
        align-items: center;
    }
`;

export const MapCustomNavigationMainContainer = styled.div`
    display: flex;
    align-items: center;
`;

export const MapCustomNavigationClose = styled.a`
    display: inline-flex;
    align-items: center;
    padding: 0.75rem 1.25rem;
    color: ${({ theme }) => theme.color.onDark.mediumEmphasis};
    transition: 0.075s;

    & svg {
        width: 1.25rem;
        fill: ${({ theme }) => theme.color.onDark.mediumEmphasis};
        transform: rotate(180deg);

        ${media.tablet} {
            margin-right: 0.5rem;
        }
    }

    & .ui-Typography {
        display: none;

        ${media.tablet} {
            display: initial;
        }
    }

    &:hover {
        color: ${({ theme }) => theme.color.onDark.highEmphasis};

        & svg {
            fill: ${({ theme }) => theme.color.onDark.highEmphasis};
        }
    }
`;

export const MapCustomNavigationMain = styled.div`
    display: flex;
    align-items: center;
    padding: 0.75rem 1.5rem;
    overflow: hidden;
`;

export const MapCustomNavigationMainLogoContainer = styled.div`
    display: flex;
    flex-shrink: 0;
    width: 2.5rem;
    height: 2.5rem;
    margin-right: 1rem;
    border-radius: 100%;
    overflow: hidden;
`;

export const MapCustomNavigationMainLogo = styled.img`
    max-width: 100%;
    margin: auto;
`;

export const MapCustomNavigationMainName = styled(Typography)`
    margin-right: auto;

    ${media.mobile} {
        min-width: 12rem;
        max-width: 16rem;
    }
`;

export const MapCustomNavigationLinksContainer = styled.div`
    display: flex;
    align-items: center;
    padding-right: 0.5rem;
    padding-left: 1rem;

    ${media.tablet} {
        padding-left: 0;
    }
`;

type MapCustomNavigationLinkProps = {
    isOpen?: boolean;
};

export const MapCustomNavigationLink = styled.button<MapCustomNavigationLinkProps>`
    position: relative;
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem 1rem;
    color: ${({ theme, isOpen }) => (isOpen ? theme.color.onDark.highEmphasis : theme.color.onDark.mediumEmphasis)};

    & svg {
        margin-top: 0.125rem;
        margin-left: 0.125rem;
        width: 1.25rem;
        fill: ${({ theme, isOpen }) => (isOpen ? theme.color.onDark.highEmphasis : theme.color.onDark.mediumEmphasis)};
        transition: 0.075s;

        ${({ isOpen }) =>
            isOpen && {
                transform: 'rotate(90deg)',
            }}
    }

    &:hover {
        color: ${({ theme }) => theme.color.onDark.highEmphasis};

        & svg {
            fill: ${({ theme }) => theme.color.onDark.highEmphasis};
        }
    }

    ${media.tablet} {
        padding: 1rem 0.5rem;
    }
`;
