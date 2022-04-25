import styled from 'styled-components';

import media from 'styles/media';

export const MapContainer = styled.div`
    position: relative;
    flex-grow: 1;
    display: flex;
    background-color: ${({ theme }) => theme.color.tertiary.dark};
    overflow: hidden;

    & .full-spot-overlay {
        position: absolute;
        background: rgba(31, 31, 31, 0.5);

        ${media.tablet} {
            padding: 1.5rem;
        }
    }

    & .full-spot-container {
        padding: 0 !important;
        border: 1.5px solid ${({ theme }) => theme.color.tertiary.medium};
        border-radius: 0.25rem;
        background-color: ${({ theme }) => theme.color.tertiary.dark};
        box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.25);
        overflow: hidden;
    }

    & .full-spot-close-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.75rem;
        height: 1.75rem;
        background-color: ${({ theme }) => theme.color.onDark.divider};
        border-radius: 50%;

        & svg {
            width: 1.1.755rem;
            height: 1.25rem;
            fill: ${({ theme }) => theme.color.onDark.mediumEmphasis};
        }
    }
`;

export const MapComponent = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
`;

export const MapControlContainer = styled.div`
    position: absolute;
    right: 1rem;
    bottom: 1rem;
    z-index: 10;

    ${media.tablet} {
        right: 1.5rem;
        bottom: 1.5rem;
    }
`;
