import styled from 'styled-components';
import media from 'styles/media';
import Typography from '../typography/Typography';

export const OneColumnPage = styled.div`
    flex-grow: 1;
    width: 100%;
    padding: 6rem 0;
    color: ${({ theme }) => theme.color.onDark.highEmphasis};
    background-color: ${({ theme }) => theme.color.tertiary.dark};
`;

export const OneColumnPageInnerContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 0 auto;
    padding: 0 1.5rem;

    ${media.tablet} {
        max-width: 32rem;
        padding: 0;
    }
`;

export const OneColumnPageTitle = styled(Typography)`
    text-align: center;
`;

export const OneColumnPageContent = styled.div`
    color: ${({ theme }) => theme.color.onDark.mediumEmphasis};

    & ul {
        margin: 1.5rem 0;
    }

    & li {
        list-style: initial;
        list-style-position: inside;
        margin-bottom: 0.5rem;
    }

    & .ui-Typography {
        font-size: 1.125rem;
        display: inline;
    }

    & a {
        color: ${({ theme }) => theme.color.onDark.highEmphasis};
        text-decoration: underline;
    }
`;

export const CTA = styled.a`
    position: relative;
    padding: 0.25rem 1.5rem;
    margin: 2rem auto 4rem;
    text-align: center;
    color: ${({ theme }) => theme.color.onLight.highEmphasis};
    background-color: ${({ theme }) => theme.color.onDark.highEmphasis};
    border-radius: 0.25rem;
    cursor: pointer;

    ${media.laptopS} {
        top: inherit;
        left: inherit;
        right: inherit;
        padding: 0.5rem 1.5rem;

        & .ui-Typography {
            font-size: 1rem;
        }

        &::after {
            content: '';
            position: absolute;
            top: 0.5rem;
            left: 0.5rem;
            width: 100%;
            height: 100%;
            border: 1px solid ${({ theme }) => theme.color.onDark.mediumEmphasis};
            border-radius: 0.25rem;
            transition: 0.1s;
            transition-timing-function: ease-in-out;
        }

        &:hover {
            &::after {
                top: 0;
                left: 0;
            }
        }
    }
`;
