import React, { memo, useState } from 'react';
import { Formik, Field, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';

import ButtonPrimary from '@/components/Ui/Button/ButtonPrimary/ButtonPrimary';
import Emoji from '@/components/Ui/Icons/Emoji';
import Typography from '@/components/Ui/typography/Typography';

import Feudartifice from '@/shared/feudartifice';
import { CarrelageAPIError } from '@/shared/feudartifice/types';
import { AxiosError } from 'axios';

type ForgotFormValues = {
    email: string;
};

const ForgotFormSchema = Yup.object().shape({
    email: Yup.string().email().required(),
});

const ForgotPasswordContainer = () => {
    const [success, setSuccess] = useState(false);

    const onSubmit = async (values: ForgotFormValues, helpers: FormikHelpers<ForgotFormValues>) => {
        try {
            await Feudartifice.auth.forgotPassword(values.email);
            // TODO: Display success notification for user to check their email
            setSuccess(true);
        } catch (err) {
            if (err instanceof AxiosError) {
                const error = err.response as CarrelageAPIError;
                helpers.setFieldError('email', error.data.message);
            }
        }
    };

    return (
        <div className="grow flex flex-col w-full py-8 text-onDark-highEmphasis bg-tertiary-dark">
            <div className="w-full max-w-[20rem] flex flex-col mx-auto">
                <Typography component="condensedHeading5" className="mb-8 text-center">
                    Forgot your password?
                </Typography>
                <Typography component="body1" className="mb-16 text-center text-onDark-mediumEmphasis">
                    Give us your email and
                    <br />
                    we will send you a verification link.
                </Typography>
                {success ? (
                    <div id="auth-form-success">
                        <h2>Email sent!</h2>
                        <p>An email has been sent with further instructions</p>
                    </div>
                ) : (
                    <Formik initialValues={{ email: '' }} validationSchema={ForgotFormSchema} onSubmit={onSubmit}>
                        {({ errors, isSubmitting, isValid, dirty, touched }) => (
                            <Form>
                                {/* Email input */}
                                <div className="relative flex items-center mb-4 bg-tertiary-medium rounded overflow-hidden last:mb-0 [&_input]:w-full [&_input]:p-4 [&_input]:text-base [&_input]:text-onDark-highEmphasis [&_input]:bg-tertiary-medium [&_input]:outline-none [&_.emoji]:shrink-0 [&_.emoji]:w-4 [&_.emoji]:ml-4 [&_.emoji]:text-onDark-mediumEmphasis">
                                    <Emoji label="email" symbol="📭" />
                                    <Field name="email" type="email" placeholder="Email" />
                                </div>

                                {/* Submit */}
                                <div className="relative mt-4 pt-14">
                                    {touched.email && errors.email != null && (
                                        <div className="absolute top-0 left-0 right-0">
                                            {errors.email !== null && (
                                                <Typography component="body2" className="text-system-error">
                                                    {errors.email}
                                                </Typography>
                                            )}
                                        </div>
                                    )}
                                    <ButtonPrimary
                                        type="submit"
                                        loading={isSubmitting}
                                        disabled={isSubmitting || !isValid || !dirty}
                                        fullWidth
                                    >
                                        Send email
                                    </ButtonPrimary>
                                </div>
                            </Form>
                        )}
                    </Formik>
                )}
            </div>
        </div>
    );
};

export default memo(ForgotPasswordContainer);
