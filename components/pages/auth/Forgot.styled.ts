import Typography from 'components/Ui/typography/Typography';
import styled from 'styled-components';

export const ForgotTitle = styled(Typography)`
    text-align: center;
`;

export const ForgotDescription = styled(Typography)`
    margin: 2rem 0 4rem;
    text-align: center;
    color: ${({ theme }) => theme.color.onDark.mediumEmphasis};
`;
