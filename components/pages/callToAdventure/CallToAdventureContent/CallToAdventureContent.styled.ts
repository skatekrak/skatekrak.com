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
        color: ${({ theme }) => theme.color.onDark.highEmphasis};
        text-decoration: underline;
    }
`;

export const CallTiAdventureQuote = styled(CallToAdventureBody)`
    margin-top: -1rem;
    padding-left: 1rem;
    border-left: 2px solid ${({ theme }) => theme.color.onDark.mediumEmphasis};
`;

export const CallTiAdventureBullet = styled(CallToAdventureBody)`
    margin-bottom: 1rem;
    padding-left: 2rem;
`;

export const CallTiAdventureImage = styled.img`
    max-width: 100%;
    margin-bottom: 2rem;
    border-radius: 0.25rem;
`;

export const CallToAdventureImageLegend = styled(Typography)`
    margin-top: -1rem;
    font-style: italic;
    color: ${({ theme }) => theme.color.onDark.mediumEmphasis};
`;
