import styled from 'styled-components';

import media from 'styles/media';

export const MapQuickAccessMobileContainer = styled.div`
    position: absolute;
    left: 9.25rem;
    bottom: 1rem;
    display: flex;
    align-items: center;
    z-index: 10;

    ${media.tablet} {
        left: 9.75rem;
        bottom: 1.5rem;
    }
`;

export const MapQuickAccessMobileTrigger = styled.button`
    display: flex;
    align-items: center;
    min-height: 3.5rem;
    margin-right: 0.5rem;
    padding: 0.625rem 1rem;
    color: ${({ theme }) => theme.color.onDark.highEmphasis};
    background-color: ${({ theme }) => theme.color.tertiary.dark};
    border: 1.5px solid ${({ theme }) => theme.color.tertiary.medium};
    border-radius: 0.25rem;
    box-shadow: ${({ theme }) => theme.shadow.onDark.highSharp};

    &:last-child {
        margin-right: 0;
    }
`;
