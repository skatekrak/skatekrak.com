import styled from 'styled-components';

import Typography from 'components/Ui/typography/Typography';

export const MapCustomNavigationVideosContainer = styled.div`
    padding: 1.5rem;
`;

export const MapCustomNavigationVideo = styled.div`
    margin-bottom: 2rem;

    &:last-child {
        margin-bottom: 0;
    }
`;

export const MapCustomNavigationVideoTitle = styled(Typography)`
    margin-bottom: 1rem;
`;
