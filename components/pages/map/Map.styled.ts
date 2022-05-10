import styled from 'styled-components';

import media from 'styles/media';

export const MapContainer = styled.div`
    position: relative;
    flex-grow: 1;
    display: flex;
    background-color: ${({ theme }) => theme.color.tertiary.dark};
    overflow: hidden;
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
