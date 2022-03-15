import Typography from 'components/Ui/typography/Typography';
import styled from 'styled-components';

export const ForgotDescription = styled(Typography)`
    margin-bottom: 4rem;
    text-align: center;
    color: ${({ theme }) => theme.color.onDark.mediumEmphasis};
`;
