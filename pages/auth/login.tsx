import React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { Formik, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import _ from 'lodash';
import Feudartifice from 'shared/feudartifice';

import Layout from 'components/Layout';
import IconFacebook from 'components/Ui/Icons/Logos/IconFacebook';
import IconApple from 'components/Ui/Icons/Logos/IconApple';
import Typography from 'components/Ui/typography/Typography';
import ButtonPrimary from 'components/Ui/Button/ButtonPrimary/ButtonPrimary';
import Emoji from 'components/Ui/Icons/Emoji';

import * as S from 'components/pages/auth/Auth.styled';
import * as SL from 'components/pages/auth/Login.styled';
import { CarrelageAPIError } from 'shared/feudartifice/types';
import { useRouter } from 'next/router';

type LoginFormValues = {
    username: string;
    password: string;
    remember: boolean;
};

const LoginFormSchema = Yup.object().shape({
    username: Yup.string()
        .min(1, 'Username must be more than one letter')
        .max(15, 'Username cannot be more than 15 letters')
        .matches(/^[a-z0-9_]+$/, {
            message: "Username should only contains alphanumeric or '_' characters",
            excludeEmptyString: true,
        })
        .required('Username cannot be empty')
        .default(''),
    password: Yup.string().required('Password cannot be empty').default(''),
    remember: Yup.boolean().default(false),
});

const Login: NextPage = () => {
    const router = useRouter();

    const onSubmit = async (values: LoginFormValues, helpers: FormikHelpers<LoginFormValues>) => {
        try {
            await Feudartifice.auth.login({
                username: values.username,
                password: values.password,
                mobile: values.remember,
            });
            router.push('/');
        } catch (err) {
            if (err.response) {
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
                        initialValues={LoginFormSchema.getDefault()}
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
                                    <Link href="/auth/forgot-password">
                                        <SL.LoginForgotLink>
                                            <Typography component="body2">Forgot your password?</Typography>
                                        </SL.LoginForgotLink>
                                    </Link>
                                </SL.LoginRememberForgotContainer>

                                {/* Submit */}
                                <S.AuthSubmitContainer>
                                    {/* First check if we have at least one error */}
                                    {_.some(errors, (value) => !_.isNil(value)) && (
                                        <S.AuthSubmitErrorContainer>
                                            {/* Display the first error found which isn't nil and is touched */}
                                            <S.AuthSubmitError component="body2">
                                                {
                                                    errors[
                                                        _.first(
                                                            Object.keys(errors).filter(
                                                                (key) =>
                                                                    !_.isNil(errors[key]) && !_.isNil(touched[key]),
                                                            ),
                                                        )
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
                                        <S.AuthButtonPrimaryLink>
                                            <Typography component="button">Create my account</Typography>
                                        </S.AuthButtonPrimaryLink>
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

export default Login;
