import React from 'react';
import { NextPage } from 'next';
import { Formik, Field, FormikErrors, FormikHelpers } from 'formik';

import Layout from 'components/Layout';
import ButtonPrimary from 'components/Ui/Button/ButtonPrimary/ButtonPrimary';
import Emoji from 'components/Ui/Icons/Emoji';

import * as S from 'components/pages/auth/Auth.styled';
import * as SF from 'components/pages/auth/Forgot.styled';

type ForgotFormValues = {
    email: string;
};

const ForgotPassword: NextPage = () => {
    const initialValues: ForgotFormValues = {
        email: '',
    };

    const onSubmit = async (values: ForgotFormValues, helpers: FormikHelpers<ForgotFormValues>) => {
        console.log('value: ', values);
    };

    return (
        <Layout>
            <S.AuthPageContainer>
                <S.AuthUniqueColumnPage>
                    <SF.ForgotTitle component="condensedHeading5">Forgot your password?</SF.ForgotTitle>
                    <SF.ForgotDescription component="body1">
                        Give us your email and
                        <br />
                        we will send you a verification link.
                    </SF.ForgotDescription>
                    <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
                        {({ errors, isSubmitting, handleSubmit, isValid, dirty, touched }) => (
                            <form onSubmit={handleSubmit}>
                                {/* Email input */}
                                <S.AuthInputField>
                                    <Emoji label="email" symbol="📭" />
                                    <Field name="email" type="email" placeholder="Email" />
                                </S.AuthInputField>

                                {/* Submit */}
                                <S.AuthSubmitContainer>
                                    {touched.email && errors.email != null && (
                                        <S.AuthSubmitErrorContainer>
                                            {errors.email !== null && (
                                                <S.AuthSubmitError component="body2">{errors.email}</S.AuthSubmitError>
                                            )}
                                        </S.AuthSubmitErrorContainer>
                                    )}
                                    <ButtonPrimary
                                        type="submit"
                                        loading={isSubmitting}
                                        disabled={isSubmitting || !isValid || !dirty}
                                        fullWidth
                                    >
                                        Send email
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

const validate = (values: ForgotFormValues): FormikErrors<ForgotFormValues> => {
    const errors: FormikErrors<ForgotFormValues> = {};

    if (values.email === '') {
        errors.email = 'Email needs to be valide';
    }

    return errors;
};

export default ForgotPassword;
