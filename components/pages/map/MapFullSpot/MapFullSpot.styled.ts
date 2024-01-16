import React from 'react';
import styled from 'styled-components';

import media from 'styles/media';
import { themeData } from 'styles/Theme/ThemeStore';

export const MapFullSpotModalOverlayStyles: React.CSSProperties = {
    position: 'absolute',
    background: 'rgba(31, 31, 31, 0.5)',
};

export const MapFullSpotModalStyles: React.CSSProperties = {
    padding: '0',
    color: `${themeData.color.onDark.highEmphasis}`,
    background: `${themeData.color.tertiary.dark}`,
    border: `1px solid ${themeData.color.tertiary.medium}`,
    borderRadius: '0.25rem',
    boxShadow: '0px 0px 16px rgba(0, 0, 0, 0.25)',
    overflow: 'hidden',
};

export const MapFullSpotModalCloseButtonStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '1.75rem',
    height: '1.75rem',
    backgroundColor: `${themeData.color.onDark.divider}`,
    borderRadius: '50%',
};

export const MapFullSpotModalCloseIconStyles: React.CSSProperties = {
    width: '1.5rem',
    height: '1.25rem',
    fill: `${themeData.color.onDark.mediumEmphasis}`,
};

export const MapFullSpotContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    min-height: 100vh;

    ${media.tablet} {
        display: grid;
        grid-template-columns: minmax(16rem, 1fr) 3fr;
        grid-template-areas: 'fullSpotNav fullSpotMain';
        min-height: inherit;
        height: 40rem;
    }

    ${media.laptop} {
        grid-template-columns: 18rem 3fr;
        width: 64rem;
    }

    ${media.laptopL} {
        width: 72rem;
        height: 40rem;
    }

    ${media.desktop} {
        width: 88rem;
        height: 52rem;
    }
`;

export const MapFullSpotNavContainer = styled.header`
    ${media.tablet} {
        grid-area: fullSpotNav;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        border-right: 1px solid ${({ theme }) => theme.color.onDark.divider};
    }
`;

export const MapFullSpotMainContainer = styled.main`
    flex-grow: 1;
    background-color: ${({ theme }) => theme.color.tertiary.medium};

    ${media.tablet} {
        grid-area: fullSpotMain;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        overflow: hidden;
    }
`;
