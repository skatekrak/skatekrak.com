import styled from 'styled-components';

import Typography from 'components/Ui/typography/Typography';
import media from 'styles/media';

export const MapZoomAlertContainer = styled.div`
    position: absolute;
    top: 10rem;
    left: 1.5rem;
    right: 1.5rem;
    display: flex;
    flex-direction: column;

    ${media.mobile} {
        width: 21rem;
        bottom: 15vh;
        left: calc(50% - 10.5rem);
        top: inherit;
        right: inherit;
    }

    ${media.laptopS} {
        bottom: 10vh;
    }
`;

export const MapZoomAlertMessageContainer = styled.div`
    position: relative;
`;

export const MapZoomAlertMessageEmojiContainer = styled.div`
    position: absolute;
    top: -0.75rem;
    left: 1rem;
    z-index: 10;

    & span {
        font-size: 1.375rem;
    }
`;

export const MapZoomAlertMessage = styled(Typography)`
    padding: 1rem;
    font-style: italic;
    color: ${({ theme }) => theme.color.onDark.mediumEmphasis};
    background-color: ${({ theme }) => theme.color.tertiary.dark};
    border: 1px solid ${({ theme }) => theme.color.tertiary.medium};
    border-radius: 0.25rem;
    box-shadow: ${({ theme }) => theme.shadow.onDark.highSharp};
`;

export const MapZoomAlertActionContainer = styled.div`
    position: relative;
    margin: 0.5rem auto;
    padding: 0.5rem 1rem;
    text-align: center;
    color: ${({ theme }) => theme.color.map.private.default};
    opacity: 0.9;
`;

export const MapZoomAlertActionBackground = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border: 1px solid ${({ theme }) => theme.color.map.private.default};
    background-color: ${({ theme }) => theme.color.tertiary.dark};
    border-radius: 0.25rem;
    opacity: 0.7;
    z-index: -1;
`;
