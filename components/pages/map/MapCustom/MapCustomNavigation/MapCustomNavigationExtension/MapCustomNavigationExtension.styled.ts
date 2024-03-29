import styled from 'styled-components';

import media from 'styles/media';

export const MapCustomNavigationExtensionContainer = styled.div`
    position: absolute;
    width: 100%;
    margin-top: 0.25rem;
    background-color: ${({ theme }) => theme.color.tertiary.dark};
    border: 1.5px solid ${({ theme }) => theme.color.tertiary.medium};
    border-radius: 0.25rem;
    box-shadow: ${({ theme }) => theme.shadow.onDark.highSharp};

    ${media.tablet} {
        left: inherit !important;
        right: 0;
        max-width: 28rem;
        margin-top: 0.625rem;
    }
`;
