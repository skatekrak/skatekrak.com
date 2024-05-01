import styled from 'styled-components';

import Typography from '@/components/Ui/typography/Typography';
import media from '@/styles/media';

export const AuthProjectDescriptionContainer = styled.div`
    padding: 2rem;
    max-width: 40rem;

    ${media.tablet} {
        text-align: center;
    }

    ${media.laptopS} {
        padding: 3rem;
        text-align: left;
    }

    ${media.laptop} {
        padding: 3rem 4rem;
    }
`;

export const AuthProjectDescriptionSubtitle = styled(Typography)`
    margin: 1.5rem 0 2.5rem;
    color: ${({ theme }) => theme.color.onDark.mediumEmphasis};
`;

export const AuthProjectDescriptionParagraphContainer = styled.div`
    & .ui-Typography {
        margin-bottom: 1rem;

        &:last-child {
            margin-bottom: 0;
        }
    }
`;
