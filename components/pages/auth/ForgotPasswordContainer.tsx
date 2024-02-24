import React, { memo, useState } from 'react';
import { Formik, Field, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';

import ButtonPrimary from 'components/Ui/Button/ButtonPrimary/ButtonPrimary';
import Emoji from 'components/Ui/Icons/Emoji';

import * as S from 'components/pages/auth/Auth.styled';
import * as SF from 'components/pages/auth/Forgot.styled';
import Feudartifice from 'shared/feudartifice';
import { CarrelageAPIError } from 'shared/feudartifice/types';
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
        <S.AuthPageContainer>
            <S.AuthUniqueColumnPage>
                <S.AuthFormTitle component="condensedHeading5">Forgot your password?</S.AuthFormTitle>
                <SF.ForgotDescription component="body1">
                    Give us your email and
                    <br />
                    we will send you a verification link.
                </SF.ForgotDescription>
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
                            </Form>
                        )}
                    </Formik>
                )}
            </S.AuthUniqueColumnPage>
        </S.AuthPageContainer>
    );
};

export default memo(ForgotPasswordContainer);
