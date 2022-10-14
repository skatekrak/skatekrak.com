import styled from 'styled-components';
import Typography from 'components/Ui/typography/Typography';

export const CallToAdventureTitle = styled(Typography)`
    margin: 1.5rem 0 2rem;
`;

export const CallToAdventureBody = styled(Typography)`
    margin-bottom: 2rem;
    font-size: 1.125rem;
    line-height: 1.6;
    color: ${({ theme }) => theme.color.onDark.mediumEmphasis};

    & a {
        text-decoration: underline;
    }
`;
