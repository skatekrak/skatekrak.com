import React from 'react';
import { NextPage } from 'next';
import { Formik, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { isEmpty, first, shake } from 'radash';
import Feudartifice from '@/shared/feudartifice';

import Layout from '@/components/Layout';
import Typography from '@/components/Ui/typography/Typography';
import ButtonPrimary from '@/components/Ui/Button/ButtonPrimary/ButtonPrimary';
import Emoji from '@/components/Ui/Icons/Emoji';

import * as S from '@/components/pages/auth/Auth.styled';
import * as SL from '@/components/pages/auth/Login.styled';
import { CarrelageAPIError } from '@/shared/feudartifice/types';
import { useRouter } from 'next/router';
import useSession from '@/lib/hook/carrelage/use-session';
import { AxiosError } from 'axios';

type LoginFormValues = {
    username: string;
    password: string;
    remember: boolean;
};

const LoginFormSchema = Yup.object().shape({
    username: Yup.string().required('Username cannot be empty').default(''),
    password: Yup.string().required('Password cannot be empty').default(''),
    remember: Yup.boolean().default(false),
});

const Login: NextPage = () => {
    const router = useRouter();
    const { isSuccess: gotSession } = useSession();

    if (gotSession) {
        router.push('/');
    }

    const onSubmit = async (values: LoginFormValues, helpers: FormikHelpers<LoginFormValues>) => {
        try {
            await Feudartifice.auth.login({
                username: values.username,
                password: values.password,
                rememberMe: values.remember,
            });
            router.push('/');
        } catch (err) {
            if (err instanceof AxiosError) {
                console.log(JSON.stringify(err.response, undefined, 2));
                const error = err.response as CarrelageAPIError;
                helpers.setFieldError('username', error.data.message);
            }
        }
    };

    return (
        <Layout>
            <S.AuthPageContainer>
                <S.AuthUniqueColumnPage>
                    <S.LoginKrakLikeIcon />
                    <Formik
                        initialValues={{ username: '', password: '', remember: false }}
                        onSubmit={onSubmit}
                        validationSchema={LoginFormSchema}
                    >
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

                                    <SL.LoginForgotLink href="/auth/forgot-password">
                                        <Typography component="body2">Forgot your password?</Typography>
                                    </SL.LoginForgotLink>
                                </SL.LoginRememberForgotContainer>

                                {/* Submit */}
                                <S.AuthSubmitContainer>
                                    {/* First check if we have at least one error */}
                                    {Object.keys(shake(errors)).length > 0 && (
                                        <S.AuthSubmitErrorContainer>
                                            {/* Display the first error found which isn't nil and is touched */}
                                            <S.AuthSubmitError component="body2">
                                                {
                                                    errors[
                                                        first(
                                                            Object.keys(errors).filter(
                                                                (key) => !isEmpty(errors[key]) && touched[key],
                                                            ),
                                                        ) as string
                                                    ]
                                                }
                                            </S.AuthSubmitError>
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

                                {/* Sign up */}
                                <SL.LoginSignupContainer>
                                    <Typography component="subtitle1">Don’t have an account yet?</Typography>
                                    <Typography component="body2">
                                        Sign up to access all the skatespot map features, some custom maps, and our
                                        private discord server.
                                    </Typography>

                                    <S.AuthButtonPrimaryLink href="/auth/signup">
                                        <Typography component="button">Create my account</Typography>
                                    </S.AuthButtonPrimaryLink>
                                </SL.LoginSignupContainer>
                            </form>
                        )}
                    </Formik>
                </S.AuthUniqueColumnPage>
            </S.AuthPageContainer>
        </Layout>
    );
};

export default Login;
