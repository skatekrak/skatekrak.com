import styled from 'styled-components';

import Typography from '@/components/Ui/typography/Typography';

/** Overlay */
export const MapMediaOverlay = styled.div`
    display: none;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0.5rem 1rem;
    background-color: rgba(31, 31, 31, 0.6);
    z-index: 1;

    & .media-overlay-spot {
        & span {
            display: inline;
        }

        & button {
            text-decoration: underline;
            color: ${({ theme }) => theme.color.onDark.highEmphasis};
            background-color: initial;
        }
    }
`;

export const MapMediaOverlayCaption = styled(Typography)`
    margin-top: 0.25rem;
`;

/** Share */
export const MapMediaShare = styled.div`
    position: absolute;
    top: 0.5rem;
    left: 0.75rem;
    display: none;
    z-index: 10;
`;

/** Open Carousel */
export const OpenCarouselButton = styled.button`
    position: absolute;
    top: 0.625rem;
    right: 0.625rem;
    display: none;
    padding: 0.25rem;
    color: ${({ theme }) => theme.color.onDark.highEmphasis};
    background-color: ${({ theme }) => theme.color.tertiary.medium};
    border-radius: 0.25rem;
    z-index: 10;

    &:hover {
        & svg {
            fill: ${({ theme }) => theme.color.onDark.highEmphasis};
        }
    }

    & svg {
        width: 1.5rem;
        fill: ${({ theme }) => theme.color.onDark.mediumEmphasis};
    }
`;

/** Media container */
export const MapMediaContainer = styled.div`
    position: relative;
    display: flex;
    min-height: 3.5rem;
    background-color: ${({ theme }) => theme.color.onDark.divider};
    overflow: hidden;

    &:hover {
        ${MapMediaOverlay} {
            display: block;
        }

        ${MapMediaShare} {
            display: flex;
        }

        ${OpenCarouselButton} {
            display: flex;
        }
    }

    & .video-player-container {
        width: 100%;
    }

    & .video-player {
        border-radius: 0;
    }

    & .video-player .react-player__preview {
        border-radius: 0;
    }

    & img {
        width: 100%;
        height: 100%;
    }
`;

export const MapMediaSpotButton = styled.button`
    color: ${({ theme }) => theme.color.onDark.highEmphasis};
    background-color: initial;
    display: flex;
    flex-direction: row;
    align-items: center;

    &:hover {
        text-decoration: underline;
    }

    & svg {
        width: 1.75rem;
    }
`;
