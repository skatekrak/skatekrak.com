import styled from 'styled-components';

export const MapCreateSpotButton = styled.button`
    flex-shrink: 0;
    display: flex;
    margin-left: 0.75rem;
    padding: 0.625rem;
    background-color: ${({ theme }) => theme.color.tertiary.dark};
    border: 1.5px solid ${({ theme }) => theme.color.tertiary.medium};
    box-shadow: ${({ theme }) => theme.shadow.onDark.highSharp};
    border-radius: 0.25rem;
    transition: 0.1s;

    & svg {
        width: 1.5rem;
        margin: auto;
        fill: ${({ theme }) => theme.color.onDark.mediumEmphasis};
        transition: 0.1s;
    }

    &:hover {
        border: 1.5px solid ${({ theme }) => theme.color.tertiary.light};

        & svg {
            fill: ${({ theme }) => theme.color.onDark.highEmphasis};
        }
    }
`;
