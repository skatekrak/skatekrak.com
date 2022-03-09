import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Formik, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import * as _ from 'lodash';

import Layout from 'components/Layout';
import ButtonPrimary from 'components/Ui/Button/ButtonPrimary/ButtonPrimary';
import Emoji from 'components/Ui/Icons/Emoji';

import * as S from 'components/pages/auth/Auth.styled';
import Feudartifice from 'shared/feudartifice';
import { CarrelageAPIError } from 'shared/feudartifice/types';

type SignupFormValues = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
};

const SignupFormSchema = Yup.object().shape({
    username: Yup.string()
        .min(1, 'Username must be more than one letter')
        .max(15, 'Username cannot be more than 15 letters')
        .matches(/^[a-z0-9_]+$/, {
            message: "Username should only contains alphanumeric or '_' characters",
            excludeEmptyString: true,
        })
        .required()
        .default(''),
    email: Yup.string().email("This isn't a valid email").required().default(''),
    password: Yup.string().min(6, 'Password must be at least 6 characters long').required().default(''),
    confirmPassword: Yup.string().required().default(''), // check equality
});

const Signup: NextPage = () => {
    const router = useRouter();

    const onSubmit = async (values: SignupFormValues, helpers: FormikHelpers<SignupFormValues>) => {
        try {
            await Feudartifice.auth.signup({
                username: values.username,
                email: values.email,
                password: values.password,
            });

            router.push('/auth/subscribe');
        } catch (err) {
            if (err.response) {
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
                    <S.AuthFormTitle component="condensedHeading5">Join the family</S.AuthFormTitle>
                    <Formik
                        initialValues={SignupFormSchema.getDefault()}
                        validationSchema={SignupFormSchema}
                        onSubmit={onSubmit}
                    >
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

export default Signup;
