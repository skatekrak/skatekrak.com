import styled from 'styled-components';

export const SubscribeDescription = styled.div`
    & li {
        list-style: disc;
        list-style-position: inside;
        margin-bottom: 0.5rem;

        &:last-child {
            margin-bottom: 0;
        }
    }

    & .ui-Typography {
        margin-bottom: 1rem;

        &:last-child {
            margin-bottom: 0;
        }
    }
`;

export const SubscribeQuote = styled.div`
    margin: 2rem 0;
    & .ui-Typography {
        font-style: italic;
    }
`;
