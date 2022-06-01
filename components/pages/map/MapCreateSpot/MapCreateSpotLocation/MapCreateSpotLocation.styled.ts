import styled from 'styled-components';

import media from 'styles/media';

export const MapCreateSpotLocationContainer = styled.button`
    position: relative;
    width: 100%;
    padding: 1.5rem;
    text-align: left;

    ${media.tablet} {
        padding: 1.25rem 2rem;
    }
`;

export const MapCreateSpotAddLocation = styled.div`
    color: ${({ theme }) => theme.color.onDark.mediumEmphasis};

    & div {
        margin-bottom: 0.5rem;
    }
`;

export const MapCreateSpotLocationAddressContainer = styled.div`
    display: flex;
`;

export const MapCreateSpotEditLocation = styled.div`
    margin-left: auto;
    color: ${({ theme }) => theme.color.onDark.mediumEmphasis};
`;

export const MapCreateSpotLocationAddress = styled.div`
    margin-right: 1rem;
    color: ${({ theme }) => theme.color.onDark.highEmphasis};

    & .ui-Typography {
        &:last-child {
            margin-top: 0.25rem;
            text-transform: uppercase;
        }
    }
`;

type MapCreateSpotLocationHelperContainerProps = {
    isFlashing: boolean;
};

export const MapCreateSpotLocationHelperContainer = styled.div<MapCreateSpotLocationHelperContainerProps>`
    position: absolute;
    display: inline-block;
    right: calc(50% - 9.5rem);
    padding: 0.75rem 2rem;
    margin-top: 2rem;
    color: ${({ theme }) => theme.color.onDark.highEmphasis};
    background-color: ${({ theme }) => theme.color.tertiary.dark};
    border: 1px solid ${({ theme }) => theme.color.tertiary.medium};
    box-shadow: ${({ theme }) => theme.shadow.onDark.highSharp};
    border-radius: 0.25rem;
    transition: 0.1s;

    ${({ isFlashing, theme }) =>
        isFlashing && {
            color: theme.color.map.private.default,
            border: `1px solid ${theme.color.map.private.default}`,
        }}

    ${media.laptopS} {
        right: calc((100% - 24rem - 1.5rem) / 2 - 9.5rem);
        margin-top: 4rem;
    }
`;
