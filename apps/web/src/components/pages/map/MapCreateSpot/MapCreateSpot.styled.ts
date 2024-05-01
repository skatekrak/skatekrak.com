import styled from 'styled-components';
import { Field } from 'formik';

import media from '@/styles/media';

type MapCreateSpotContainerProps = {
    isMapVisible: boolean;
};

export const MapCreateSpotContainer = styled.div<MapCreateSpotContainerProps>`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    width: 100%;
    color: ${({ theme }) => theme.color.onDark.highEmphasis};
    pointer-events: none;

    ${({ isMapVisible }) =>
        isMapVisible && {
            display: 'none',
        }}

    & .icon-plus {
        width: 1.25rem;
    }

    ${media.mobile} {
        max-width: 24rem;
        top: 1rem;
        left: 1rem;
        bottom: 1rem;
    }

    ${media.laptop} {
        top: 1.5rem;
        left: 1.5rem;
        bottom: 1.5rem;
    }
`;

/*
 ****** HEADER ******
 */
export const MapCreateSpotHeader = styled.div`
    position: relative;
    padding: 1rem;
    background-color: ${({ theme }) => theme.color.tertiary.dark};
    pointer-events: initial;

    & button {
        position: absolute;
        left: 1rem;
        top: calc(50% - 1.25rem);

        & svg {
            width: 1.5rem;
            fill: ${({ theme }) => theme.color.onDark.highEmphasis};
            transform: rotate(180deg);
        }
    }

    & .ui-Typography {
        text-align: center;
    }

    ${media.mobile} {
        box-shadow: ${({ theme }) => theme.shadow.onDark.highSharp};
    }
`;

export const MapCreateSpotBackButton = styled.button`
    display: flex;
    padding: 0.5rem;
    z-index: 1;
`;

/*
 ****** MAIN ******
 */
export const MapCreateSpotMain = styled.div`
    flex-grow: 1;
    overflow: hidden;
    background-color: ${({ theme }) => theme.color.tertiary.medium};
    pointer-events: initial;

    ${media.mobile} {
        flex-grow: 0;
        background-color: ${({ theme }) => theme.color.tertiary.dark};
    }
`;

/*
 ****** NAME ******
 */
export const MapCreateSpotName = styled.div`
    padding: 1.5rem 1.5rem 2rem;

    ${media.tablet} {
        padding: 1.5rem 2rem 1.5rem;
    }
`;

export const MapCreateSpotInput = styled(Field)`
    width: 100%;
    font-family: ${({ theme }) => theme.typography.fonts.roboto.bold};
    font-size: 1.25rem;
    color: ${({ theme }) => theme.color.onDark.highEmphasis};
    background-color: inherit;
    outline: none;
`;

/*
 ****** FOOTER ******
 */
export const MapCreateSpotFooter = styled.div`
    padding: 1rem 1.5rem;
    background-color: ${({ theme }) => theme.color.tertiary.dark};
    box-shadow: ${({ theme }) => theme.shadow.onDark.highSharp};
    pointer-events: initial;
    z-index: 1;

    & button {
        width: 100%;
    }
`;

/*
 ****** GENERIC ******
 */
export const MapCreateSpotMainDivider = styled.div`
    height: 0.0625rem;
    width: 100%;
    background-color: ${({ theme }) => theme.color.onDark.divider};
`;

export const MapCreateSpotIconButton = styled.button`
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.color.onDark.mediumEmphasis};

    & .ui-Typography {
        flex-shrink: 0;
    }

    & svg {
        flex-shrink: 0;
        width: 1.25rem;
        margin-left: 0.75rem;
        fill: ${({ theme }) => theme.color.onDark.mediumEmphasis};
    }
`;
