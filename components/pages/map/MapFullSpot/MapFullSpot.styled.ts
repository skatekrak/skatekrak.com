import styled from 'styled-components';

import media from 'styles/media';

type MapFullSpotContainerProps = {
    isCarouselOpen: boolean;
};

export const MapFullSpotContainer = styled.div<MapFullSpotContainerProps>`
    position: relative;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    height: ${({ isCarouselOpen }) => (isCarouselOpen ? '100vh' : 'auto')};
    overflow: hidden;

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
