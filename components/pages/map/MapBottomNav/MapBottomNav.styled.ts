import styled from 'styled-components';

import media from 'styles/media';

export const MapBottomNavContainer = styled.div`
    position: absolute;
    left: 1rem;
    bottom: 1rem;
    display: flex;
    align-items: center;
    z-index: 20;

    ${media.tablet} {
        left: 1.5rem;
        bottom: 1.5rem;
    }
`;

export const MapBottomNavTriggerContainer = styled.div`
    margin-right: 0.5rem;

    &:last-child {
        margin-right: 0;
    }
`;

export const MapBottomNavQuickAccessTrigger = styled.button`
    display: flex;
    align-items: center;
    min-height: 3.5rem;
    padding: 0.625rem 1rem;
    color: ${({ theme }) => theme.color.onDark.highEmphasis};
    background-color: ${({ theme }) => theme.color.tertiary.dark};
    border: 1px solid ${({ theme }) => theme.color.tertiary.medium};
    border-radius: 0.25rem;
    box-shadow: ${({ theme }) => theme.shadow.onDark.highSharp};

    & svg {
        width: 1.75rem;
        height: 1.75rem;
        margin-right: 1rem;
        box-shadow: none;
    }
`;
