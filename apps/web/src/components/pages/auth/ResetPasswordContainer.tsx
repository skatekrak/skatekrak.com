import { useRouter } from 'next/router';
import React, { memo, useState } from 'react';
import { Formik, Field, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';

import ButtonPrimary from '@/components/Ui/Button/ButtonPrimary/ButtonPrimary';

import { resetPassword } from '@/lib/auth';

type ResetPasswordFormValues = {
    password: string;
};

const ResetPasswordSchema = Yup.object().shape({
    password: Yup.string()
        .min(8, 'Your password must be at least 8 characters long')
        .required('A password must be filled'),
});

const ResetPasswordContainer = () => {
    const { query } = useRouter();
    const [success, setSuccess] = useState(false);
    const token = typeof query.token === 'string' ? query.token : '';
    const tokenError = typeof query.error === 'string' ? query.error : '';

    const onSubmit = async (values: ResetPasswordFormValues, helpers: FormikHelpers<ResetPasswordFormValues>) => {
        const { error } = await resetPassword({
            newPassword: values.password,
            token,
        });

        if (error) {
            helpers.setFieldError('password', error.message ?? 'Something went wrong');
        } else {
            setSuccess(true);
        }
    };

    return (
        <div id="auth-container" className="inner-page-container container-fluid">
            <div id="auth-form-container">
                <h1 id="auth-form-title">Reset password</h1>
                {tokenError && <p>This reset link is invalid or has expired. Please request a new one.</p>}
                {!token && !tokenError && (
                    <p>Token is missing, open the link from the email we sent you</p>
                )}
                {token && !tokenError && (
                    <>
                        {success ? (
                            <div id="auth-form-success">
                                <h2>Your password has been changed!</h2>
                                <p>You can connect to the app with your new password</p>
                            </div>
                        ) : (
                            <Formik
                                initialValues={{ password: '' }}
                                validationSchema={ResetPasswordSchema}
                                onSubmit={onSubmit}
                            >
                                {({ errors, isSubmitting, isValid, dirty, touched }) => (
                                    <Form id="auth-form">
                                        <div id="auth-form-inner-container">
                                            <Field
                                                className="auth-form-input"
                                                name="password"
                                                type="password"
                                                placeholder="New password"
                                            />
                                            <ul id="auth-form-help-list">
                                                <li>must be at least 8 characters long</li>
                                            </ul>
                                        </div>
                                        {touched.password && errors.password != null && (
                                            <p className="auth-form-error">{errors.password}</p>
                                        )}
                                        <ButtonPrimary
                                            type="submit"
                                            loading={isSubmitting}
                                            className={!dirty || !isValid ? 'button-primary-disabled' : undefined}
                                            disabled={isSubmitting || !isValid}
                                        >
                                            Reset
                                        </ButtonPrimary>
                                    </Form>
                                )}
                            </Formik>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default memo(ResetPasswordContainer);
