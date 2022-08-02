import styled from 'styled-components';

import Typography from 'components/Ui/typography/Typography';
import media from 'styles/media';

export const MapFullSpotSingleMediaPreview = styled.div`
    position: relative;
`;

export const MapFullSpotSingleMediaNav = styled.div`
    display: flex;
    padding: 1rem;
    background-color: ${({ theme }) => theme.color.tertiary.dark};
    border-top: 1px solid ${({ theme }) => theme.color.onDark.divider};
    border-bottom: 1px solid ${({ theme }) => theme.color.onDark.divider};
`;

export const MapFullSpotSingleMediaNavBackButton = styled.button`
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.color.onDark.mediumEmphasis};

    & svg {
        width: 1.5rem;
        margin-right: 0.5rem;
        fill: ${({ theme }) => theme.color.onDark.mediumEmphasis};
        transform: rotate(180deg);
    }

    &:hover {
        color: ${({ theme }) => theme.color.onDark.highEmphasis};

        & svg {
            fill: ${({ theme }) => theme.color.onDark.highEmphasis};
        }
    }
`;

export const MapFullSpotSingleMediaContainer = styled.div`
    height: 20rem;
    background-color: ${({ theme }) => theme.color.tertiary.dark};

    ${media.tablet} {
        height: 28rem;
    }

    ${media.desktop} {
        height: 36rem;
    }

    & .video-player-container {
        height: 100%;
    }
`;

export const MapFullSpotSingleMediaImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: contain;
`;

export const MapFullSpotSingleCaptionContainer = styled.div`
    margin: 1.5rem 1rem;

    ${media.tablet} {
        width: 80%;
        max-width: 32rem;
        margin: 2rem auto;
    }
`;

export const MapFullSpotSingleCaptionDesc = styled(Typography)`
    margin-top: 1rem;
`;
