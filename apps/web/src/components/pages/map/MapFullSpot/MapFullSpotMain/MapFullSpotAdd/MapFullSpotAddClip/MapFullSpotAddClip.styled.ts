import styled from 'styled-components';

import Typography from '@/components/Ui/typography/Typography';
import media from '@/styles/media';
import ButtonPrimary from '@/components/Ui/Button/ButtonPrimary';

export const MapFullSpotAddClipContainer = styled.div`
    height: 100%;
    padding: 2rem 1rem;
    overflow-y: auto;

    ${media.tablet} {
        padding: 2rem;
    }
`;

export const MapFullSpotAddClipTitle = styled(Typography)`
    flex-shrink: 0;
`;

export const MapFullSpotAddClipInputRow = styled.div`
    display: flex;
    flex-direction: column;
    align-items: left;
    margin: 1.5rem 0;

    ${media.tablet} {
        flex-direction: row;
        align-items: center;
    }
`;

export const MapFullSpotAddClipInputContainer = styled.div`
    position: relative;
    margin-bottom: 1rem;

    ${media.tablet} {
        flex-grow: 1;
        margin-right: 1rem;
        margin-bottom: 0;
    }

    ${media.laptopS} {
        flex-grow: initial;
        width: 50%;
        min-width: 25rem;
        margin-right: 1rem;
        margin-bottom: 0;
    }
`;

export const MapFullSpotAddClipInput = styled.input`
    width: 100%;
    padding: 1rem;
    font-size: 1rem;
    color: ${({ theme }) => theme.color.onDark.highEmphasis};
    background-color: ${({ theme }) => theme.color.tertiary.light};
    border-radius: 0.25rem;

    &::placeholder {
        color: ${({ theme }) => theme.color.onDark.lowEmphasis};
    }
`;

export const MapFullSpotAddClipError = styled(Typography)`
    margin-top: 0.5rem;
    color: ${({ theme }) => theme.color.system.error};

    ${media.tablet} {
        position: absolute;
        top: calc(100% + 0.5rem);
        margin-top: 0;
    }
`;

export const MapFullSpotAddClipSubmit = styled(ButtonPrimary)`
    ${media.tablet} {
        width: max-content;
    }
`;

export const MapFullSpotAddClipPreviewTitle = styled(Typography)`
    margin: 2rem 0 1rem;

    ${media.tablet} {
        margin-top: 3rem;
    }
`;
