import styled from 'styled-components';
import media from '@/styles/media';

export const MapCreateSpotRainContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0 0 1.5rem;

    ${media.tablet} {
        padding: 0 0 0 2rem;
    }
`;

export const MapCreateSpotRainButtons = styled.div`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-left: 1.5rem;
`;

export const MapCreateSpotRainCheckbox = styled.label`
    display: flex;
    align-items: center;
    padding: 1.5rem;

    ${media.tablet} {
        padding: 1.25rem 1.5rem;
    }

    &:first-of-type {
        ${media.tablet} {
            padding-right: 1rem;
        }
    }

    &:last-of-type {
        ${media.tablet} {
            padding-right: 2rem;
            padding-left: 1rem;
        }
    }

    & input[type='radio'] {
        appearance: none;
        display: grid;
        place-content: center;
        background-color: inherit;
        margin: 0;
        margin-right: 0.5rem;
        font: inherit;
        color: currentColor;
        width: 1rem;
        height: 1rem;
        border: 0.1rem solid currentColor;
        border-radius: 100%;

        &:hover {
            cursor: pointer;
        }

        &::before {
            content: '';
            width: 0.5rem;
            height: 0.5rem;
            transform: scale(0);
            background-color: ${({ theme }) => theme.color.primary[50]};
            border-radius: 100%;
        }

        &:checked::before {
            transform: scale(1.125);
        }
    }

    &:last-of-type {
        margin-right: 0;
    }
`;
