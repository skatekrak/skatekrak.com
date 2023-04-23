import styled from 'styled-components';

import Typography from 'components/Ui/typography/Typography';

export const MapCard = styled.button`
    display: flex;
    flex-direction: column;
    width: 100%;
    border: 1px solid ${({ theme }) => theme.color.onDark.divider};
    border-radius: 0.5rem;

    &:hover {
        border-color: ${({ theme }) => theme.color.onDark.placeholder};
        box-shadow: ${({ theme }) => theme.shadow.onDark.high};
    }
`;

export const MapButton = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.5rem 0.75rem;
`;

export const MapName = styled(Typography)`
    margin: 0 1rem;
    text-align: left;
    color: ${({ theme }) => theme.color.onDark.mediumEmphasis};
    white-space: normal;
`;

export const MapSpots = styled(Typography)`
    flex-shrink: 0;
    margin-left: auto;
    color: ${({ theme }) => theme.color.onDark.lowEmphasis};
`;
