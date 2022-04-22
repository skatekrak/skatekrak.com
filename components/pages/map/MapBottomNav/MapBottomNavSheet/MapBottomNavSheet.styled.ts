import styled from 'styled-components';

import Typography from 'components/Ui/typography/Typography';

import media from 'styles/media';

export const MapBottomNavSheetContainer = styled.div`
    display: block;
    position: absolute;
    bottom: 0;
    left: 0;
    min-height: 20vh;
    width: 100%;
    color: ${({ theme }) => theme.color.onDark.highEmphasis};
    background-color: ${({ theme }) => theme.color.tertiary.dark};
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
        left: 0;
        bottom: 0;
        border: 1px solid ${({ theme }) => theme.color.tertiary.medium};
    }
`;

export const MapBottomNavSheetTitle = styled(Typography)`
    margin: 1rem 1.5rem;
    text-transform: uppercase;
`;
