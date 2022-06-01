import styled from 'styled-components';

import media from 'styles/media';

export const MapCreateSpotMediaContainer = styled.div`
    padding: 1.5rem;

    ${media.tablet} {
        padding: 1.25rem 2rem;
    }
`;

export const MapCreateSpotMediaGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 1rem;
    margin-top: 1rem;
`;

export const MapCreateSpotMediaItemContainer = styled.div`
    position: relative;
    padding-top: 100%;
    border-radius: 0.25rem;
    overflow: hidden;
`;

type MapCreateSpotMediaItemProps = {
    image?: string;
};

export const MapCreateSpotMediaItem = styled.div<MapCreateSpotMediaItemProps>`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: ${({ theme }) => theme.color.tertiary.light};

    ${({ image }) =>
        image !== undefined && {
            background: image,
        }}
`;

export const MapCreateSpotMediaAdd = styled.button`
    display: flex;
    width: 100%;
    height: 100%;

    &:hover {
        & svg {
            fill: ${({ theme }) => theme.color.onDark.highEmphasis};
        }
    }

    & svg {
        margin: auto;
        width: 1.5rem;
        fill: ${({ theme }) => theme.color.onDark.mediumEmphasis};
    }
`;

export const MapCreateSpotMediaRemoveButton = styled.button`
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    z-index: 1;

    & svg {
        width: 2rem;
        fill: ${({ theme }) => theme.color.onDark.mediumEmphasis};

        &:hover {
            fill: ${({ theme }) => theme.color.onDark.highEmphasis};
        }
    }
`;
