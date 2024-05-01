import styled from 'styled-components';

import media from '@/styles/media';

export const MapQuickAccessMobileCitiesGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    padding: 0 1rem 1rem;

    ${media.mobile} {
        grid-template-columns: 1fr 1fr 1fr 1fr;
    }
`;
