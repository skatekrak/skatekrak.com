import Typography from 'components/Ui/typography/Typography';
import styled from 'styled-components';
import media from 'styles/media';

export const CallToAdventurePageContainer = styled.div`
    flex-grow: 1;
    width: 100%;
    padding: 6rem 0;
    color: ${({ theme }) => theme.color.onDark.highEmphasis};
    background-color: ${({ theme }) => theme.color.tertiary.dark};
`;

export const CallToAdventureGrid = styled.div`
    width: 100%;
    max-width: 96rem;
    margin: 0 auto;
    padding: 0 1.5rem;

    ${media.laptopS} {
        display: grid;
        grid-template-columns: 1fr 3fr 1fr;
        gap: 4rem;
        padding: 0 3rem;
    }
`;

export const CallToAdventureHeader = styled.div`
    grid-column-start: 2;
`;

export const CallToAdventureContent = styled.div`
    display: flex;
    flex-direction: column;
    grid-column-start: 2;
    width: 100%;
    max-width: 48rem;
    white-space: pre-line;
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

export const CallToAdventureTitle = styled(Typography)`
    margin: 1.5rem 0 2rem;
`;

export const CallToAdventureBody = styled(Typography)`
    margin-bottom: 2rem;
    font-size: 1.25rem;
    line-height: 1.75rem;
    color: ${({ theme }) => theme.color.onDark.mediumEmphasis};

    & a {
        text-decoration: underline;
    }
`;
