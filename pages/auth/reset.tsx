import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import carrelage from 'lib/carrelageClient';
import { Formik, Field, FormikErrors, FormikHelpers } from 'formik';

import Layout from 'components/Layout/Layout';
import ButtonPrimary from 'components/Ui/Button/ButtonPrimary';

type ResetPasswordFormValues = {
    resetToken: string;
    password: string;
};

const ResetPassword: NextPage = () => {
    const { query } = useRouter();
    const [success, setSuccess] = useState(false);

    const initialValues: ResetPasswordFormValues = {
        resetToken: typeof query.token === 'string' ? query.token : '',
        password: '',
    };

    const onSubmit = async (values: ResetPasswordFormValues, helpers: FormikHelpers<ResetPasswordFormValues>) => {
        try {
            await carrelage.post('/auth/reset', {
                ...values,
            });
            setSuccess(true);
        } catch (err) {
            console.error(err);
            if (err.response) {
                helpers.setFieldError('password', err.response.data.message);
            }
        } finally {
            helpers.setSubmitting(false);
        }
    };

    return (
        <Layout>
            <div id="auth-container" className="inner-page-container container-fluid">
                <div id="auth-form-container">
                    <h1 id="auth-form-title">Reset password</h1>
                    {(query.token == null || query.token === '') && (
                        <p>Token is missing, open the link from the email we sent you</p>
                    )}
                    {query.token != null && query.token !== '' && (
                        <>
                            {success ? (
                                <div id="auth-form-success">
                                    <h2>Your password has been changed!</h2>
                                    <p>You can connect to the app with your new password</p>
                                </div>
                            ) : (
                                <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
                                    {({ errors, isSubmitting, handleSubmit, values }) => (
                                        <form id="auth-form" onSubmit={handleSubmit}>
                                            <div id="auth-form-inner-container">
                                                <Field
                                                    className="auth-form-input"
                                                    name="password"
                                                    type="password"
                                                    placeholder="New password"
                                                />
                                                <ul id="auth-form-help-list">
                                                    <li>must be at least 6 characters long</li>
                                                </ul>
                                            </div>
                                            {errors.password != null && (
                                                <p className="auth-form-error">{errors.password}</p>
                                            )}
                                            <ButtonPrimary
                                                type="submit"
                                                loading={isSubmitting}
                                                className={
                                                    (Object.keys(errors).length !== 0 ||
                                                        values.password.length === 0) &&
                                                    'button-primary-disabled'
                                                }
                                                disabled={
                                                    isSubmitting ||
                                                    Object.keys(errors).length !== 0 ||
                                                    values.password.length === 0
                                                }
                                            >
                                                Reset
                                            </ButtonPrimary>
                                        </form>
                                    )}
                                </Formik>
                            )}
                        </>
                    )}
                </div>
            </div>
        </Layout>
    );
};

const validate = (values: ResetPasswordFormValues): FormikErrors<ResetPasswordFormValues> => {
    const errors: FormikErrors<ResetPasswordFormValues> = {};

    if (values.resetToken === '') {
        errors.resetToken = 'Token cannot be empty';
    }

    if (values.password === '') {
        errors.password = 'Password cannot be empty';
    } else if (values.password.length < 6) {
        errors.password = 'Password must be at least 6 characters long';
    }

    return errors;
};

export default ResetPassword;
