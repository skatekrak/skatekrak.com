import styled from 'styled-components';

export const MapFullSpotAddTriggerButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: auto;
    padding: 0.25rem;
    border: 1px solid ${({ theme }) => theme.color.primary[100]};
    border-radius: 0.25rem;

    & .icon-plus {
        width: 1.5rem;
        fill: ${({ theme }) => theme.color.primary[100]};
    }

    &:hover {
        & .icon-plus {
            fill: ${({ theme }) => theme.color.primary[80]};
        }
    }
`;

export const MapFullSpotAddTriggerTooltipContainer = styled.div`
    width: 10rem;
    background-color: ${({ theme }) => theme.color.tertiary.dark};
    border: 1px solid ${({ theme }) => theme.color.tertiary.medium};
    border-radius: 0.25rem;
    box-shadow: ${({ theme }) => theme.shadow.onDark.highSharp};
    z-index: 1;
`;

export const MapFullSpotAddTriggerTooltipButton = styled.button`
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.5rem 1rem;
    text-align: left;
    color: ${({ theme }) => theme.color.onDark.highEmphasis};
    border-bottom: 1px solid ${({ theme }) => theme.color.onDark.divider};

    &:hover {
        background-color: ${({ theme }) => theme.color.tertiary.medium};
    }

    &:last-of-type {
        border-bottom: 0;
    }

    & .krak-icon {
        width: 1.25rem;
        margin-right: 0.5rem;
        fill: ${({ theme }) => theme.color.onDark.highEmphasis};
    }
`;
