import styled from 'styled-components';

type MapQuickAccessMobileCitiesContainerProps = {
    isOpen: boolean;
};

export const MapQuickAccessMobileCitiesContainer = styled.div<MapQuickAccessMobileCitiesContainerProps>`
    display: none;
    width: 24rem;
    padding: 1rem;
    color: ${({ theme }) => theme.color.onDark.highEmphasis};
    background-color: ${({ theme }) => theme.color.tertiary.dark};

    ${({ isOpen }) =>
        isOpen && {
            display: 'block !important',
        }}
`;
