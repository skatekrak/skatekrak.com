import styled from 'styled-components';

import Typography from 'components/Ui/typography/Typography';
import media from 'styles/media';
import ButtonPrimary from 'components/Ui/Button/ButtonPrimary';

export const MapFullSpotAddMediaTabContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 2rem 1rem;
    overflow-y: auto;

    ${media.tablet} {
        padding: 2rem;
    }
`;

export const MapFullSpotAddMediaGrid = styled.div`
    ${media.laptopS} {
        display: grid;
        grid-template-columns: 2fr 1.25fr;
        grid-gap: 2rem;
        height: 100%;
        margin-top: 2rem;
    }

    ${media.laptopL} {
        grid-template-columns: 2fr minmax(18rem, 1fr);
    }
`;

export const MapFullSpotAddMediaSecondaryColumn = styled.div`
    display: flex;
    flex-direction: column;
`;

export const MapFullSpotAddMediaTitle = styled(Typography)`
    flex-shrink: 0;
    margin-bottom: 0.5rem;
`;

export const MapFullSpotAddMediaSubtitle = styled(Typography)`
    flex-shrink: 0;
    color: ${({ theme }) => theme.color.onDark.mediumEmphasis};
`;

export const MapFullSpotAddMediaAddContainer = styled.div`
    position: relative;
    max-width: 100%;
    padding-top: 100%;
    margin: 2rem 0;
    border-radius: 0.25rem;
    background-color: ${({ theme }) => theme.color.tertiary.light};
    overflow: hidden;

    ${media.laptopS} {
        margin: 0;
        padding-top: inherit;
    }
`;

export const MapFullSpotAddMediaAdd = styled.button`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;

    &:hover {
        & svg {
            fill: ${({ theme }) => theme.color.onDark.highEmphasis};
        }
    }

    & svg {
        margin: auto;
        width: 1.5rem;
        fill: ${({ theme }) => theme.color.onDark.mediumEmphasis};
    }
`;

export const MapFullSpotAddMediaImage = styled.img`
    position: relative;
    width: 100%;
    height: 100%;
    object-fit: cover;
    margin: auto;
    background-color: ${({ theme }) => theme.color.tertiary.dark};
`;

export const MapFullSpotAddMediaRemoveButton = styled.button`
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    display: flex;
    background-color: ${({ theme }) => theme.color.tertiary.light};
    border-radius: 100%;
    z-index: 1;

    & svg {
        width: 2rem;
        fill: ${({ theme }) => theme.color.onDark.mediumEmphasis};

        &:hover {
            fill: ${({ theme }) => theme.color.onDark.highEmphasis};
        }
    }
`;

export const MapFullSpotAddMediaCaption = styled.textarea`
    width: 100%;
    margin-top: 1rem;
    margin-bottom: 2rem;
    padding: 1rem;
    font-size: 1rem;
    color: ${({ theme }) => theme.color.onDark.highEmphasis};
    background-color: ${({ theme }) => theme.color.tertiary.light};
    border-radius: 0.25rem;
    resize: vertical;

    &::placeholder {
        color: ${({ theme }) => theme.color.onDark.lowEmphasis};
    }
`;

export const MapFullSpotAddMediaSubmitButton = styled(ButtonPrimary)`
    width: 100%;
    margin-top: auto;
`;
