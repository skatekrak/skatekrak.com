import React from 'react';
import { NextPage } from 'next';
import { Formik, Field, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';

import Layout from 'components/Layout';
import ButtonPrimary from 'components/Ui/Button/ButtonPrimary/ButtonPrimary';
import Emoji from 'components/Ui/Icons/Emoji';

import * as S from 'components/pages/auth/Auth.styled';
import * as SF from 'components/pages/auth/Forgot.styled';
import Feudartifice from 'shared/feudartifice';
import { CarrelageAPIError } from 'shared/feudartifice/types';
import useSession from 'lib/hook/carrelage/use-session';
import { useRouter } from 'next/router';

type ForgotFormValues = {
    email: string;
};

const ForgotFormSchema = Yup.object().shape({
    email: Yup.string().email().required().default(''),
});

const ForgotPassword: NextPage = () => {
    const router = useRouter();
    const { isSuccess: gotSession, isLoading } = useSession();

    if (gotSession) {
        router.push('/');
    }

    if (isLoading) {
        // TODO: Display loading page
    }

    const onSubmit = async (values: ForgotFormValues, helpers: FormikHelpers<ForgotFormValues>) => {
        try {
            await Feudartifice.auth.forgotPassword(values.email);
            // TODO: Display success notification for user to check their email
        } catch (err) {
            if (err.response) {
                const error = err.response as CarrelageAPIError;
                helpers.setFieldError('email', error.data.message);
            }
        }
    };

    return (
        <Layout>
            <S.AuthPageContainer>
                <S.AuthUniqueColumnPage>
                    <S.AuthFormTitle component="condensedHeading5">Forgot your password?</S.AuthFormTitle>
                    <SF.ForgotDescription component="body1">
                        Give us your email and
                        <br />
                        we will send you a verification link.
                    </SF.ForgotDescription>
                    <Formik
                        initialValues={ForgotFormSchema.getDefault()}
                        validationSchema={ForgotFormSchema}
                        onSubmit={onSubmit}
                    >
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
                </S.AuthUniqueColumnPage>
            </S.AuthPageContainer>
        </Layout>
    );
};

export default ForgotPassword;
