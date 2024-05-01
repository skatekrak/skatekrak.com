import styled from 'styled-components';

type PanelProps = {
    isOpen: boolean;
};

export const Panel = styled.div<PanelProps>`
    display: none;
    width: 23rem;
    color: ${({ theme }) => theme.color.onDark.highEmphasis};
    background-color: ${({ theme }) => theme.color.tertiary.dark};
    border: 1px solid ${({ theme }) => theme.color.tertiary.medium};
    border-radius: 0.25rem;
    box-shadow: ${({ theme }) => theme.shadow.onDark.highSharp};

    ${({ isOpen }) =>
        isOpen && {
            display: 'block !important',
        }}
`;
