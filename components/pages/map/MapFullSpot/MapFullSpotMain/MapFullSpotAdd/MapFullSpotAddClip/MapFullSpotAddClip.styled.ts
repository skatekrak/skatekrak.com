import styled from 'styled-components';

import Typography from 'components/Ui/typography/Typography';
import media from 'styles/media';
import ButtonPrimary from 'components/Ui/Button/ButtonPrimary';

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

export const MapFullSpotAddClipInput = styled.input`
    width: 100%;
    margin: 1.5rem 0;
    padding: 1rem;
    font-size: 1rem;
    color: ${({ theme }) => theme.color.onDark.highEmphasis};
    background-color: ${({ theme }) => theme.color.tertiary.light};
    border-radius: 0.25rem;

    &::placeholder {
        color: ${({ theme }) => theme.color.onDark.lowEmphasis};
    }

    ${media.laptopS} {
        width: 50%;
        min-width: 25rem;
        margin-bottom: 1rem;
        margin-right: 1rem;
    }
`;

export const MapFullSpotAddClipSubmit = styled(ButtonPrimary)`
    ${media.tablet} {
        width: max-content;
    }
`;

export const MapFullSpotAddClipPreviewTitle = styled(Typography)`
    margin: 2rem 0 1rem;
`;
