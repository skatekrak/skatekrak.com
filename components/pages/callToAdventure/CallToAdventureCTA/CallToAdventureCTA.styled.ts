import styled from 'styled-components';

export const CallToAdventureCTAContainer = styled.div`
    position: relative;
    margin-top: 4rem;
`;

export const CallToAdventureLink = styled.a`
    position: fixed;
    padding: 0.5rem 1.5rem;
    color: ${({ theme }) => theme.color.onLight.highEmphasis};
    background-color: ${({ theme }) => theme.color.onDark.highEmphasis};
    border-radius: 0.25rem;
    cursor: pointer;

    & .ui-Typography {
        font-size: 1rem;
    }

    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: 1px solid ${({ theme }) => theme.color.onDark.mediumEmphasis};
        border-radius: 0.25rem;
        transition: 0.1s;
        transition-timing-function: ease-in-out;
    }

    &:hover {
        background-color: ${({ theme }) => theme.color.onDark.highEmphasis};

        &::after {
            top: 0.5rem;
            left: 0.5rem;
        }
    }
`;
