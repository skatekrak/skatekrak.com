import styled from 'styled-components';

import Typography from '@/components/Ui/typography/Typography';

export const City = styled.button`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 5rem;
    margin: auto;
    padding: 0.5rem;
    color: ${({ theme }) => theme.color.onDark.highEmphasis};
    border: 0;
`;

export const CityImage = styled.div`
    width: 3.5rem;
    height: 3.5rem;
    background-color: ${({ theme }) => theme.color.tertiary.medium};
    background-size: cover;
    background-position: center;
    border: 2px solid ${({ theme }) => theme.color.tertiary.light};
    border-radius: 100%;
`;

export const CityName = styled(Typography)`
    width: 100%;
    margin-top: 0.25rem;
`;
