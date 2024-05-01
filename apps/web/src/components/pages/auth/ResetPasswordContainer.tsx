import { useRouter } from 'next/router';
import React, { memo, useState } from 'react';
import { Formik, Field, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';

import ButtonPrimary from '@/components/Ui/Button/ButtonPrimary/ButtonPrimary';
import Feudartifice from '@/shared/feudartifice';
import { AxiosError } from 'axios';
import { CarrelageAPIError } from '@/shared/feudartifice/types';

type ResetPasswordFormValues = {
    resetToken: string;
    password: string;
};

const ResetPasswordSchema = Yup.object().shape({
    resetToken: Yup.string().required('Your reset token cannot be empty'),
    password: Yup.string()
        .min(6, 'Your password must be at least 6 characters long')
        .required('A password must be filled'),
});

const ResetPasswordContainer = () => {
    const { query } = useRouter();
    const [success, setSuccess] = useState(false);

    const initialValues: ResetPasswordFormValues = {
        resetToken: typeof query.token === 'string' ? query.token : '',
        password: '',
    };

    const onSubmit = async (values: ResetPasswordFormValues, helpers: FormikHelpers<ResetPasswordFormValues>) => {
        try {
            await Feudartifice.auth.resetPassword(values);
            setSuccess(true);
        } catch (err) {
            console.error(err);
            if (err instanceof AxiosError) {
                const error = err.response as CarrelageAPIError;
                helpers.setFieldError('password', error.data.message);
            }
        }
    };

    return (
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
                            <Formik
                                initialValues={initialValues}
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
                                                <li>must be at least 6 characters long</li>
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
