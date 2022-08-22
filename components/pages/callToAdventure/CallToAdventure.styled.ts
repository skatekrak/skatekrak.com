import Typography from 'components/Ui/typography/Typography';
import styled from 'styled-components';

export const CallToAdventurePageContainer = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 2rem 0;
    color: ${({ theme }) => theme.color.onDark.highEmphasis};
    background-color: ${({ theme }) => theme.color.tertiary.dark};
`;

export const CallToAdventureContent = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 40rem;
    margin: 0 auto;
    padding: 4rem 1.5rem;
`;

export const CallToAdventureH1 = styled(Typography)`
    margin-bottom: 3rem;
    font-family: ${({ theme }) => theme.typography.fonts.roboto.condensed.bold};
    font-size: 2.5rem;
    text-transform: uppercase;

    & span {
        text-transform: lowercase;
    }
`;

export const CallToAdventureIntro = styled(Typography)`
    font-family: ${({ theme }) => theme.typography.fonts.roboto.regular};
    margin-bottom: 2rem;
`;

export const CallToAdventureBody = styled(Typography)`
    font-size: 1.25rem;
    line-height: 1.625rem;
    color: ${({ theme }) => theme.color.onDark.mediumEmphasis};
`;

export const CallToAdventureIsTyping = styled(Typography)`
    margin-top: 4rem;
    /* color: ${({ theme }) => theme.color.onDark.mediumEmphasis}; */
    font-style: italic;
`;
