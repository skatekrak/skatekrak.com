import styled, { css } from 'styled-components';

import media from '@/styles/media';

export const MapCreateSpotTypeMain = styled.button`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 1.5rem;

    ${media.tablet} {
        padding: 1.25rem 2rem;
    }
`;

export const MapCreateSpotTypeSelected = styled.div`
    display: flex;
    align-items: center;
    flex-grow: 1;
    color: ${({ theme }) => theme.color.onDark.highEmphasis};

    & svg {
        width: 2.5rem;
        margin-right: 0.5rem;
    }
`;

export const MapCreateSpotTypeSelection = styled.div`
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-gap: 1.5rem;
    padding: 0 1.5rem 1.5rem;

    ${media.tablet} {
        padding: 0 2rem 1.25rem;
    }
`;

type MapCreateSpotTypeSelectionProps = {
    isSelected: boolean;
};

export const MapCreateSpotTypeSelectionButton = styled.button<MapCreateSpotTypeSelectionProps>`
    margin: auto;
    color: ${({ theme }) => theme.color.onDark.mediumEmphasis};

    & svg {
        width: 2.5rem;
    }

    ${({ theme, isSelected }) =>
        !isSelected &&
        css`
            & .map-icon-stroke-outter {
                fill: ${theme.color.onDark.lowEmphasis};
            }

            & .map-icon-street-fill,
            .map-icon-park-fill,
            .map-icon-shop-fill,
            .map-icon-private-fill,
            .map-icon-diy-fill {
                fill: ${theme.color.tertiary.light};
            }
        `}
`;
