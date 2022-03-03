import React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { Formik, Field, FormikErrors, FormikHelpers } from 'formik';

import Layout from 'components/Layout';
import IconFacebook from 'components/Ui/Icons/Logos/IconFacebook';
import IconApple from 'components/Ui/Icons/Logos/IconApple';
import Typography from 'components/Ui/typography/Typography';
import ButtonPrimary from 'components/Ui/Button/ButtonPrimary/ButtonPrimary';
import Emoji from 'components/Ui/Icons/Emoji';

import * as S from 'components/pages/auth/Auth.styled';
import * as SL from 'components/pages/auth/Login.styled';

type LoginFormValues = {
    username: string;
    password: string;
    remember: boolean;
};

const Login: NextPage = () => {
    const initialValues: LoginFormValues = {
        username: '',
        password: '',
        remember: false,
    };

    const onSubmit = async (values: LoginFormValues, helpers: FormikHelpers<LoginFormValues>) => {
        console.log('value: ', values);
    };

    return (
        <Layout>
            <S.AuthPageContainer>
                <S.AuthUniqueColumnPage>
                    <SL.LoginKrakLikeIcon />
                    <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
                        {({ errors, isSubmitting, handleSubmit, isValid, dirty, touched }) => (
                            <form onSubmit={handleSubmit}>
                                {/* Login inputs */}
                                <S.AuthInputField>
                                    <Emoji label="username" symbol="@" />
                                    <Field name="username" type="username" placeholder="Username" />
                                </S.AuthInputField>
                                <S.AuthInputField>
                                    <Emoji label="password" symbol="🔒" />
                                    <Field name="password" type="password" placeholder="Password" />
                                </S.AuthInputField>

                                {/* Remember & Forgot */}
                                <SL.LoginRememberForgotContainer>
                                    <SL.LoginRememberMe>
                                        <Field name="remember" type="checkbox" />
                                        <Typography as="span" component="body2">
                                            Remember me
                                        </Typography>
                                    </SL.LoginRememberMe>
                                    <Link href="/auth/forgot-password">
                                        <SL.LoginForgotLink>
                                            <Typography component="body2">Forgot your password?</Typography>
                                        </SL.LoginForgotLink>
                                    </Link>
                                </SL.LoginRememberForgotContainer>

                                {/* Submit */}
                                <S.AuthSubmitContainer>
                                    {(touched.username || touched.password) &&
                                        (errors.password != null || errors.username != null) && (
                                            <S.AuthSubmitErrorContainer>
                                                {errors.username !== null && (
                                                    <S.AuthSubmitError component="body2">
                                                        {errors.username}
                                                    </S.AuthSubmitError>
                                                )}
                                                {errors.password !== null && (
                                                    <S.AuthSubmitError component="body2">
                                                        {errors.password}
                                                    </S.AuthSubmitError>
                                                )}
                                            </S.AuthSubmitErrorContainer>
                                        )}
                                    <ButtonPrimary
                                        type="submit"
                                        loading={isSubmitting}
                                        disabled={isSubmitting || !isValid || !dirty}
                                        fullWidth
                                    >
                                        Login
                                    </ButtonPrimary>
                                </S.AuthSubmitContainer>

                                {/* Social login */}
                                <SL.LoginScoialAuth>
                                    <SL.LoginFacebook onClick={null} icon={<IconFacebook />}>
                                        Facebook
                                    </SL.LoginFacebook>
                                    <SL.LoginApple onClick={null} icon={<IconApple />}>
                                        Apple
                                    </SL.LoginApple>
                                </SL.LoginScoialAuth>

                                {/* Sign up */}
                                <SL.LoginSignupContainer>
                                    <Typography component="subtitle1">Don’t have an account yet?</Typography>
                                    <Typography component="body2">
                                        Sign up to access all map features, custom maps and private discord channels.
                                    </Typography>
                                    <Link href="/auth/signup" passHref>
                                        <SL.LoginSignupLink>
                                            <Typography component="button">Create my account</Typography>
                                        </SL.LoginSignupLink>
                                    </Link>
                                </SL.LoginSignupContainer>
                            </form>
                        )}
                    </Formik>
                </S.AuthUniqueColumnPage>
            </S.AuthPageContainer>
        </Layout>
    );
};

const validate = (values: LoginFormValues): FormikErrors<LoginFormValues> => {
    const errors: FormikErrors<LoginFormValues> = {};

    if (values.username === '') {
        errors.username = 'Username cannot be empty';
    }

    if (values.password === '') {
        errors.password = 'Password cannot be empty';
    }

    return errors;
};

export default Login;
