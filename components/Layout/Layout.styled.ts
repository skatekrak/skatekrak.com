import styled from 'styled-components';

export const LayoutPageContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100vh;
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
