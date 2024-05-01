import styled from 'styled-components';

import Typography from '@/components/Ui/typography/Typography';

import media from '@/styles/media';

export const MapBottomNavSheetContainer = styled.div`
    position: absolute;
    display: block;
    bottom: 0;
    left: 0;
    min-height: 20vh;
    width: calc(100vw - 2rem);
    color: ${({ theme }) => theme.color.onDark.highEmphasis};
    background-color: ${({ theme }) => theme.color.tertiary.dark};
    border: 1px solid ${({ theme }) => theme.color.tertiary.medium};
    border-radius: 0.25rem;
    box-shadow: ${({ theme }) => theme.shadow.onDark.highSharp};
    z-index: 1000;

    & .krak-close-button {
        position: absolute;
        top: 1rem;
        right: 1rem;
        z-index: 1;
    }

    ${media.mobile} {
        width: calc(100vw - 3rem);
    }
`;

export const MapBottomNavSheetTitle = styled(Typography)`
    margin: 1rem 1.5rem;
    text-transform: uppercase;
`;
