import KrakLogoHand from 'components/Ui/branding/KrakLogoHand';
import Typography from 'components/Ui/typography/Typography';
import styled from 'styled-components';
import media from 'styles/media';

/** AD */
export const ArticleAdContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 12rem;
    height: 100%;
    padding: 1.5rem;
    background-color: $grey-800;
    background: url('/images/club-presentation-bg.jpg');
    background-size: cover;
    background-position: center;
    border-radius: 0.25rem;
`;

export const ArticleAdKrakLogo = styled(KrakLogoHand)`
    width: 80%;
    max-width: 10rem;
    margin: auto;
    padding: 1rem 0 2rem;
    fill: ${({ theme }) => theme.color.onDark.highEmphasis};
`;

export const ArticleAdCTAContainer = styled.div`
    display: flex;
    flex-direction: column;

    ${media.mobile} {
        margin: 0 auto;
    }
    ${media.tablet} {
        margin: 0;
    }
`;

export const ArticleAdCTAText = styled(Typography)`
    margin-bottom: 0.75rem;
    color: ${({ theme }) => theme.color.onDark.highEmphasis};
    text-align: center;

    ${media.laptopS} {
        margin-bottom: 1rem;
    }
`;

export const ArticleAdCTA = styled.a`
    padding: 0.5rem 1rem;
    font-family: $ff-roboto-bold;
    text-align: center;
    color: ${({ theme }) => theme.color.onDark.highEmphasis};
    border-radius: 0.25rem;
    background-color: ${({ theme }) => theme.color.primary[80]};
    box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.25);
    transition: 0.2s;
    cursor: pointer;

    &:hover {
        background-color: ${({ theme }) => theme.color.primary[100]};
    }
`;
