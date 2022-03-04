import styled from 'styled-components';

import Typography from 'components/Ui/typography/Typography';
import IconLike from 'components/Ui/Icons/IconLike';

export const AuthPageContainer = styled.div`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 2rem 0;
    color: ${({ theme }) => theme.color.onDark.highEmphasis};
    background-color: ${({ theme }) => theme.color.tertiary.dark};
`;

export const AuthUniqueColumnPage = styled.div`
    width: 100%;
    max-width: 20rem;
    display: flex;
    flex-direction: column;
    margin: auto;
`;

export const LoginKrakLikeIcon = styled(IconLike)`
    width: 3rem;
    margin: 0 auto 2rem;
    fill: #a738ff;
`;

export const AuthFormTitle = styled(Typography)`
    margin-bottom: 2rem;
    text-align: center;
`;

export const AuthInputField = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    background-color: ${({ theme }) => theme.color.tertiary.medium};
    border-radius: 0.25rem;
    overflow: hidden;

    & input {
        width: 100%;
        padding: 1rem;
        font-size: 1rem;
        color: ${({ theme }) => theme.color.onDark.highEmphasis};
        background-color: ${({ theme }) => theme.color.tertiary.medium};
        outline: none;

        &::placeholder {
            color: $grey-500;
        }
    }

    & .emoji {
        flex-shrink: 0;
        width: 1rem;
        margin-left: 1rem;
        color: ${({ theme }) => theme.color.onDark.mediumEmphasis};
    }

    &:last-child {
        margin-bottom: 0;
    }
`;

export const AuthSubmitContainer = styled.div`
    position: relative;
    margin-top: 1rem;
    padding-top: 3.5rem;
`;

export const AuthSubmitErrorContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
`;

export const AuthSubmitError = styled(Typography)`
    color: ${({ theme }) => theme.color.system.error};
`;

export const AuthButtonPrimaryLink = styled.a`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 2rem;
    color: ${({ theme }) => theme.color.onDark.highEmphasis};
    background-color: ${({ theme }) => theme.color.primary[80]};
    border-radius: 0.25rem;
    transition: 0.2s;

    &:hover {
        background-color: ${({ theme }) => theme.color.primary[100]};
    }
`;
