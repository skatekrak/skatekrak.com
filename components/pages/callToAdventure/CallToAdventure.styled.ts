import Typography from 'components/Ui/typography/Typography';
import styled, { keyframes } from 'styled-components';

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
    max-width: 48rem;
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
    line-height: 1.75rem;
    color: ${({ theme }) => theme.color.onDark.mediumEmphasis};

    & a {
        text-decoration: underline;
    }
`;

export const CallToAdventureIsTyping = styled.div`
    display: flex;
    margin-top: 4rem;
    font-style: italic;
`;

export const CallToAdventureIsTypingKrak = styled(Typography)`
    margin-right: 0.375rem;
    font-style: normal;
`;

type CallToAdventureIsTypingAnimationProps = {
    delay?: number;
};

const typingAnimation = keyframes`
    0%, 60% { transform: translateY(0) }
    30% { transform: translateY(-0.1875rem) }
`;

export const CallToAdventureIsTypingAnimation = styled.div<CallToAdventureIsTypingAnimationProps>`
    animation: ${typingAnimation} 1s ease-in-out infinite;
    margin-right: 0.0625rem;

    &:first-of-type {
        margin-left: 0.25rem;
    }

    ${({ delay }) =>
        delay && {
            animationDelay: `${delay}s`,
        }};
`;
