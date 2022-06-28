import styled from 'styled-components';

import Typography from 'components/Ui/typography/Typography';
import media from 'styles/media';
import ButtonPrimary from 'components/Ui/Button/ButtonPrimary';

export const MapFullSpotAddClipContainer = styled.div`
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

export const MapFullSpotAddClipTitle = styled(Typography)`
    flex-shrink: 0;
`;

export const MapFullSpotAddClipInput = styled.input`
    margin: 1.5rem 0 2rem;
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
    }
`;

export const MapFullSpotAddClipSubmit = styled(ButtonPrimary)`
    ${media.tablet} {
        width: max-content;
    }
`;
