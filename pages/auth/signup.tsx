import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Formik, Field, FormikErrors, FormikHelpers } from 'formik';

import Layout from 'components/Layout';
import ButtonPrimary from 'components/Ui/Button/ButtonPrimary/ButtonPrimary';
import Emoji from 'components/Ui/Icons/Emoji';

import * as S from 'components/pages/auth/Auth.styled';

type SignupFormValues = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
};

const Signup: NextPage = () => {
    const router = useRouter();

    const initialValues: SignupFormValues = {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    };

    const onSubmit = async (values: SignupFormValues, helpers: FormikHelpers<SignupFormValues>) => {
        console.log('value: ', values);
        router.push('/auth/subscribe');
    };

    return (
        <Layout>
            <S.AuthPageContainer>
                <S.AuthUniqueColumnPage>
                    <S.LoginKrakLikeIcon />
                    <S.AuthFormTitle component="condensedHeading5">Join the family</S.AuthFormTitle>
                    <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
                        {({ errors, isSubmitting, handleSubmit, isValid, dirty, touched }) => (
                            <form onSubmit={handleSubmit}>
                                {/* Signup inputs */}
                                <S.AuthInputField>
                                    <Emoji label="username" symbol="@" />
                                    <Field name="username" type="username" placeholder="Username" />
                                </S.AuthInputField>
                                <S.AuthInputField>
                                    <Emoji label="email" symbol="📭" />
                                    <Field name="email" type="email" placeholder="Email" />
                                </S.AuthInputField>
                                <S.AuthInputField>
                                    <Emoji label="password" symbol="🔒" />
                                    <Field name="password" type="password" placeholder="Password" />
                                </S.AuthInputField>
                                <S.AuthInputField>
                                    <Emoji label="confirmPassword" symbol="🔒" />
                                    <Field name="confirmPassword" type="password" placeholder="Confirm password" />
                                </S.AuthInputField>

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
                                        Create my account
                                    </ButtonPrimary>
                                </S.AuthSubmitContainer>
                            </form>
                        )}
                    </Formik>
                </S.AuthUniqueColumnPage>
            </S.AuthPageContainer>
        </Layout>
    );
};

const validate = (values: SignupFormValues): FormikErrors<SignupFormValues> => {
    const errors: FormikErrors<SignupFormValues> = {};

    if (values.username === '' || values.password === '' || values.email === '') {
        errors.username = 'All the fields are required';
    }
    if (values.password !== values.confirmPassword) {
        errors.password = 'Passwords must match';
    }

    return errors;
};

export default Signup;
