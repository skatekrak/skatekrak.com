import styled from 'styled-components';

import Typography from 'components/Ui/typography/Typography';
import media from 'styles/media';

/* MAIN */
export const MapFullSpotMainContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
`;

export const MapFullSpotMainHeader = styled.div`
    width: 100%;
    padding: 2rem 3rem;
    transition: 0.3s;

    ${media.laptopL} {
        padding: 3rem 5rem;
    }

    & .map-full-spot-popup-main-header--fixed {
        padding: 0rem 3rem;
        box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.25);

        ${media.laptopL} {
            padding: 0rem 5rem;
        }
    }
`;

export const MapFullSpotMainHeaderNav = styled.div`
    display: flex;
    align-items: center;
`;

export const MapFullSpotMainHeaderNavItem = styled.div`
    padding: 1rem;
    font-size: $fs-regular;
    color: $grey-500;
    text-decoration: underline;

    &:hover {
        color: $grey-300;
    }

    &:first-child {
        margin-left: -1rem;
    }
`;

/* CLIPS */
export const MapFullSpotMainClips = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: 1.5rem;

    ${media.tablet} {
        padding: 3rem;
    }

    ${media.laptopL} {
        padding: 5rem;
    }
`;

export const MapFullSpotMainClip = styled.div`
    margin-bottom: 2rem;

    &:last-child {
        margin-bottom: 0;
    }

    ${media.tablet} {
        margin-bottom: 4rem;
    }
`;

export const MapFullSpotMainClipTitle = styled(Typography)`
    margin-bottom: 1rem;
`;

/* MEDIA */
export const MapFullSpotMainMediaGridContainer = styled.div`
    display: block;
    padding: 1.5rem;

    & .icon-loading-krak {
        margin: 4rem auto 2rem;
    }

    ${media.tablet} {
        padding: 3rem;
    }
`;
