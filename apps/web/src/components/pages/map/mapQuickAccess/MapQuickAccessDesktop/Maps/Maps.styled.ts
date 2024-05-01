import Typography from '@/components/Ui/typography/Typography';
import styled from 'styled-components';

export const MapsContainer = styled.div`
    padding: 1.5rem;
`;

export const Maps = styled.div`
    display: grid;
    grid-gap: 0.5rem;
`;

export const MapsCategoryTitle = styled(Typography)`
    margin-bottom: 1.5rem;
    color: ${({ theme }) => theme.color.onDark.highEmphasis};
`;
