import styled from 'styled-components';

export const HeaderProfileMenuContainer = styled.div`
    width: 10rem;
    padding: 0.375rem 0;
    border-radius: 0.25rem;
    background-color: ${({ theme }) => theme.color.tertiary.dark};
    border: 1px solid ${({ theme }) => theme.color.tertiary.medium};
    box-shadow: ${({ theme }) => theme.shadow.onDark.highSharp};
    overflow: hidden;
`;
