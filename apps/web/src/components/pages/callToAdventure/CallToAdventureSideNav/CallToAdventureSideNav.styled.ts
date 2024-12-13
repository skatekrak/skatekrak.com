import Typography from '@/components/Ui/typography/Typography';
import styled, { keyframes } from 'styled-components';
import media from '@/styles/media';

export const CallToAdventureSideNav = styled.div`
    display: none;

    ${media.laptopS} {
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 10rem;
        margin-top: 2rem;
    }

    ${media.laptop} {
        max-width: 13rem;
    }
`;

type CallToAdventureSideNavLinkProps = {
    $isActive: boolean;
};

export const CallToAdventureSideNavLink = styled.a<CallToAdventureSideNavLinkProps>`
    display: block;
    padding: 0.75rem 0;
    color: ${({ theme }) => theme.color.onDark.mediumEmphasis};
    cursor: pointer;

    &:hover {
        color: ${({ theme }) => theme.color.onDark.highEmphasis};
    }

    ${({ $isActive: isActive, theme }) =>
        isActive && {
            fontFamily: theme.typography.fonts.roboto.bold,
            color: theme.color.onDark.highEmphasis,
        }}
`;

/** Not in the app anymore but could be still useful in the future */
export const CallToAdventureIsTyping = styled.div`
    display: flex;
    margin-top: 1.5rem;
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
