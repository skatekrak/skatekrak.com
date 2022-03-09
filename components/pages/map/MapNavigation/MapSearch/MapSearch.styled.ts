import styled from 'styled-components';

export const MapSearchContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    z-index: 1;
`;

export const MapSearchBar = styled.div`
    display: flex;
    align-items: center;
    padding: 1rem 1rem 1rem 1rem;
    background-color: ${({ theme }) => theme.color.tertiary.dark};
    border: 1px solid ${({ theme }) => theme.color.tertiary.medium};
    border-radius: 0.25rem;
    box-shadow: ${({ theme }) => theme.shadow.onDark.highSharp};

    & input {
        width: 100%;
        font-size: 1rem;
        color: ${({ theme }) => theme.color.onDark.highEmphasis};
        background-color: inherit;
        outline: none;

        &::placeholder {
            color: ${({ theme }) => theme.color.onDark.mediumEmphasis};
        }
    }

    & button {
        display: flex;
        margin-left: 1rem;
    }

    & svg {
        flex-shrink: 0;
        width: 1.5rem !important;
        fill: ${({ theme }) => theme.color.onDark.lowEmphasis};
    }
`;
