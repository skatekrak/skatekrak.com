import styled from 'styled-components';

export const LayoutPageContainer = styled.div`
    position: absolute;
    display: flex;
    flex-direction: column;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
`;

export const LayoutMainContainer = styled.div`
    position: relative;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    color: ${({ theme }) => theme.color.onLight.highEmphasis};
    overflow-y: auto;
    z-index: 1;
`;
