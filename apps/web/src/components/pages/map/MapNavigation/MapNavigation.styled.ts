import styled from 'styled-components';

import media from '@/styles/media';

export const MapNavigation = styled.div`
    position: absolute;
    top: 1rem;
    left: 1rem;
    right: 1rem;
    z-index: 990;

    ${media.tablet} {
        right: inherit;
        min-width: 24rem;
    }

    ${media.laptop} {
        top: 1.5rem;
        left: 1.5rem;
    }
`;

export const MapNavigationMain = styled.div`
    display: flex;
    align-items: center;
`;
