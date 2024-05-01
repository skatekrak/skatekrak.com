import styled, { css } from 'styled-components';

type ToggleButtonProps = {
    isOpen: boolean;
};

export const ToggleButton = styled.button<ToggleButtonProps>`
    position: relative;
    display: flex;
    padding: 0.375rem 0.75rem;
    color: ${({ theme }) => theme.color.onDark.highEmphasis};
    cursor: pointer;

    ${({ isOpen }) =>
        isOpen &&
        css`
            ${Tooltip} {
                display: none !important;
            }
        `}
`;

export const Tooltip = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 0.5rem 0.75rem 1rem;
    text-align: right;
    color: ${({ theme }) => theme.color.onDark.highEmphasis};
    background-color: ${({ theme }) => theme.color.tertiary.dark};
    border: 1px solid ${({ theme }) => theme.color.tertiary.medium};
    border-radius: 0.25rem;
    box-shadow: ${({ theme }) => theme.shadow.onDark.highSharp};
    cursor: pointer;
    z-index: 9999999999;

    & svg {
        width: 1.25rem;
        margin-left: 0.5rem;
        margin-top: 0.125rem;
        fill: ${({ theme }) => theme.color.onDark.highEmphasis};
    }
`;
