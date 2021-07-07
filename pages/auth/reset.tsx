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

    if (success) {
        return (
            <Layout>
                <h1>Your password has been changed!</h1>
                <p>You can connect to the app with your new password</p>
            </Layout>
        );
    }

    return (
        <Layout>
            {(query.token == null || query.token === '') && <h1>Token is missing</h1>}
            {query.token != null && query.token !== '' && (
                <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 250 }}>
                    <Formik initialValues={initialValues} validate={validate} onSubmit={onSubmit}>
                        {({ errors, isSubmitting, handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                                <label>New password</label>
                                <Field name="password" type="password" />
                                <ButtonPrimary type="submit" disabled={isSubmitting}>
                                    Reset
                                </ButtonPrimary>
                                {errors.password != null && <h5 style={{ color: 'red' }}>{errors.password}</h5>}
                            </form>
                        )}
                    </Formik>
                </div>
            )}
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
