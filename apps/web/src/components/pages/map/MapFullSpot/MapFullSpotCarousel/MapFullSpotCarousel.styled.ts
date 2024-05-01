import styled from 'styled-components';

export const CarouselContainer = styled.div`
    position: absolute;
    inset: 0;
    display: flex;
    z-index: 10;
`;

export const AdditionalActions = styled.button`
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.color.onDark.mediumEmphasis};
    text-decoration: underline;
    font-size: 0.875rem;

    & svg {
        width: 1.125rem;
        margin-right: 0.25rem;
        margin-top: 1px;
        fill: ${({ theme }) => theme.color.onDark.mediumEmphasis};
        transform: rotate(180deg);
    }

    &:hover {
        color: ${({ theme }) => theme.color.onDark.highEmphasis};

        & svg {
            fill: ${({ theme }) => theme.color.onDark.highEmphasis};
        }
    }
`;
