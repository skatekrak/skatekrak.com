import styled from 'styled-components';

import Typography from '@/components/Ui/typography/Typography';
import media from '@/styles/media';

export const MapZoomAlertContainer = styled.div`
    position: absolute;
    top: 10rem;
    left: 1.5rem;
    right: 1.5rem;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    background-color: ${({ theme }) => theme.color.tertiary.dark};
    border: 1px solid ${({ theme }) => theme.color.tertiary.medium};
    border-radius: 0.25rem;
    box-shadow: ${({ theme }) => theme.shadow.onDark.highSharp};
    pointer-events: none;

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

export const MapZoomAlertEmojiContainer = styled.div`
    position: absolute;
    top: -0.75rem;
    left: 1rem;
    z-index: 10;

    & span {
        font-size: 1.375rem;
    }
`;

export const MapZoomAlertMessage = styled(Typography)`
    font-style: italic;
    color: ${({ theme }) => theme.color.onDark.mediumEmphasis};
`;

export const MapZoomAlertAction = styled(Typography)`
    margin-top: 0.5rem;
    color: ${({ theme }) => theme.color.map.private.default};
`;
