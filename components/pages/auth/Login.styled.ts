import styled from 'styled-components';

import IconLike from 'components/Ui/Icons/IconLike';
import ButtonPrimary from 'components/Ui/Button/ButtonPrimary';

export const LoginContainer = styled.div`
    width: 100%;
    max-width: 20rem;
    display: flex;
    flex-direction: column;
    margin: auto;
    padding: 5rem 0;
`;

export const LoginKrakLikeIcon = styled(IconLike)`
    width: 3rem;
    margin: 0 auto 2rem;
    fill: #a738ff;
`;

export const LoginRememberForgotContainer = styled.div`
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.color.onDark.lowEmphasis};
`;

export const LoginRememberMe = styled.label`
    display: flex;
    align-items: center;
    margin-right: auto;

    & input[type='checkbox'] {
        appearance: none;
        display: grid;
        place-content: center;
        background-color: inherit;
        margin: 0;
        margin-right: 0.5rem;
        font: inherit;
        color: currentColor;
        width: 0.875rem;
        height: 0.875rem;
        border: 0.1rem solid currentColor;
        border-radius: 100%;

        &:hover {
            cursor: pointer;
        }

        &::before {
            content: '';
            width: 0.35rem;
            height: 0.35rem;
            transform: scale(0);
            transition: 75ms transform ease-in-out;
            background-color: ${({ theme }) => theme.color.onDark.mediumEmphasis};
            border-radius: 100%;
        }

        &:checked::before {
            transform: scale(1);
        }
    }
`;

export const LoginForgotLink = styled.a`
    text-decoration: underline;
    cursor: pointer;
`;

export const LoginScoialAuth = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-top: 1.5rem;
`;

export const LoginFacebook = styled(ButtonPrimary)`
    background-color: #4267b2;

    &:hover {
        background-color: #34528d;
    }
`;

export const LoginApple = styled(ButtonPrimary)`
    color: ${({ theme }) => theme.color.onLight.highEmphasis};
    background-color: ${({ theme }) => theme.color.tertiary.white};

    &:hover {
        background-color: ${({ theme }) => theme.color.onDark.mediumEmphasis};
    }
`;

export const LoginSignupContainer = styled.div`
    margin-top: 4rem;
    text-align: center;
    color: ${({ theme }) => theme.color.onDark.highEmphasis};

    & .ui-Typography:nth-child(0n + 2) {
        margin: 0.75rem 0 1.5rem;
        color: ${({ theme }) => theme.color.onDark.mediumEmphasis};
    }
`;

export const LoginSignupLink = styled.a`
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
