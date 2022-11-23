import styled from 'styled-components';
import media from 'styles/media';

export const CallToAdventureCTAContainer = styled.div`
    position: relative;
    order: 1;
    display: flex;
    flex-direction: column;
    margin-top: 4rem;
    align-items: flex-end;
`;

export const CallToAdventureLink = styled.a`
    position: fixed;
    top: 4rem;
    left: 0;
    right: 0;
    padding: 0.25rem 1.5rem;
    text-align: center;
    color: ${({ theme }) => theme.color.onLight.highEmphasis};
    background-color: #ffdc73;
    cursor: pointer;

    ${media.laptopS} {
        top: inherit;
        left: inherit;
        right: inherit;
        padding: 0.5rem 1.5rem;
        background-color: ${({ theme }) => theme.color.onDark.highEmphasis};
        border-radius: 0.25rem;

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
