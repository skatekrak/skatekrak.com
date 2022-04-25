import styled from 'styled-components';

import Typography from 'components/Ui/typography/Typography';

export const MapCustomNavigationAboutContainer = styled.div`
    padding: 1.5rem;
`;

export const MapCustomNavigationAboutTitle = styled(Typography)`
    margin-bottom: 1rem;
`;
export const MapCustomNavigationAboutDesc = styled(Typography)`
    color: ${({ theme }) => theme.color.onDark.mediumEmphasis};
    white-space: pre-wrap;
`;
