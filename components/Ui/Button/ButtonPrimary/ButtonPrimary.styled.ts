import styled from 'styled-components';

type ButtonPrimaryContainerProps = {
    fullWidth?: boolean;
};

export const ButtonPrimaryContainer = styled.button<ButtonPrimaryContainerProps>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 2rem;
    color: ${({ theme }) => theme.color.onDark.highEmphasis};
    background-color: ${({ theme }) => theme.color.primary[80]};
    border-radius: 0.25rem;
    transition: 0.15s;

    ${({ fullWidth }) =>
        fullWidth && {
            width: '100%',
        }}

    &:hover {
        background-color: ${({ theme }) => theme.color.primary[100]};
    }

    &:disabled {
        color: ${({ theme }) => theme.color.onDark.lowEmphasis};
        background-color: ${({ theme }) => theme.color.tertiary.light};

        &:hover {
            background-color: ${({ theme }) => theme.color.tertiary.light};
        }

        & .spinner-circle {
            & .path {
                stroke: ${({ theme }) => theme.color.onDark.lowEmphasis};
            }
        }
    }

    & .spinner-circle {
        height: 1.5rem;
        width: 1.5rem;
        margin-right: 1rem;

        & .path {
            stroke: ${({ theme }) => theme.color.onDark.highEmphasis};
        }
    }

    & .icon {
        margin-left: -1rem;
        margin-right: 0.5rem;
    }
`;
