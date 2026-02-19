import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Formik, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { isEmpty, first, shake } from 'radash';

import Layout from '@/components/Layout';
import ButtonPrimary from '@/components/Ui/Button/ButtonPrimary/ButtonPrimary';
import Emoji from '@/components/Ui/Icons/Emoji';
import IconLike from '@/components/Ui/Icons/IconLike';
import Typography from '@/components/Ui/typography/Typography';

import Feudartifice from '@/shared/feudartifice';
import { CarrelageAPIError } from '@/shared/feudartifice/types';
import { AxiosError } from 'axios';

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
                mobile: false,
            });

            router.push('/auth/subscribe');
        } catch (err) {
            if (err instanceof AxiosError) {
                const error = err.response as CarrelageAPIError;
                helpers.setFieldError('username', error.data.message);
            }
        }
    };

    return (
        <Layout>
            <div className="grow flex flex-col w-full py-8 text-onDark-highEmphasis bg-tertiary-dark">
                <div className="w-full max-w-[20rem] flex flex-col mx-auto">
                    <IconLike className="w-12 mx-auto mb-8 fill-[#a738ff]" />
                    <Typography component="condensedHeading5" className="mb-8 text-center">
                        Join the family
                    </Typography>
                    <Formik
                        initialValues={{ username: '', email: '', password: '', confirmPassword: '' }}
                        validationSchema={SignupFormSchema}
                        onSubmit={onSubmit}
                    >
                        {({ errors, isSubmitting, handleSubmit, isValid, dirty, touched }) => (
                            <form onSubmit={handleSubmit}>
                                {/* Signup inputs */}
                                <div className="relative flex items-center mb-4 bg-tertiary-medium rounded overflow-hidden last:mb-0 [&_input]:w-full [&_input]:p-4 [&_input]:text-base [&_input]:text-onDark-highEmphasis [&_input]:bg-tertiary-medium [&_input]:outline-none [&_.emoji]:shrink-0 [&_.emoji]:w-4 [&_.emoji]:ml-4 [&_.emoji]:text-onDark-mediumEmphasis">
                                    <Emoji label="username" symbol="@" />
                                    <Field name="username" type="username" placeholder="Username" />
                                </div>
                                <div className="relative flex items-center mb-4 bg-tertiary-medium rounded overflow-hidden last:mb-0 [&_input]:w-full [&_input]:p-4 [&_input]:text-base [&_input]:text-onDark-highEmphasis [&_input]:bg-tertiary-medium [&_input]:outline-none [&_.emoji]:shrink-0 [&_.emoji]:w-4 [&_.emoji]:ml-4 [&_.emoji]:text-onDark-mediumEmphasis">
                                    <Emoji label="email" symbol="📭" />
                                    <Field name="email" type="email" placeholder="Email" />
                                </div>
                                <div className="relative flex items-center mb-4 bg-tertiary-medium rounded overflow-hidden last:mb-0 [&_input]:w-full [&_input]:p-4 [&_input]:text-base [&_input]:text-onDark-highEmphasis [&_input]:bg-tertiary-medium [&_input]:outline-none [&_.emoji]:shrink-0 [&_.emoji]:w-4 [&_.emoji]:ml-4 [&_.emoji]:text-onDark-mediumEmphasis">
                                    <Emoji label="password" symbol="🔒" />
                                    <Field name="password" type="password" placeholder="Password" />
                                </div>
                                <div className="relative flex items-center mb-4 bg-tertiary-medium rounded overflow-hidden last:mb-0 [&_input]:w-full [&_input]:p-4 [&_input]:text-base [&_input]:text-onDark-highEmphasis [&_input]:bg-tertiary-medium [&_input]:outline-none [&_.emoji]:shrink-0 [&_.emoji]:w-4 [&_.emoji]:ml-4 [&_.emoji]:text-onDark-mediumEmphasis">
                                    <Emoji label="confirmPassword" symbol="🔒" />
                                    <Field name="confirmPassword" type="password" placeholder="Confirm password" />
                                </div>

                                {/* Submit */}
                                <div className="relative mt-4 pt-14">
                                    {/* First check if we have at least one error */}
                                    {Object.keys(shake(errors)).length > 0 && (
                                        <div className="absolute top-0 left-0 right-0">
                                            {/* Display the first error found which isn't nil and is touched */}
                                            <Typography component="body2" className="text-system-error">
                                                {
                                                    errors[
                                                        first(
                                                            Object.keys(errors).filter(
                                                                (key) => !isEmpty(errors[key]) && touched[key],
                                                            ),
                                                        ) as string
                                                    ]
                                                }
                                            </Typography>
                                        </div>
                                    )}
                                    <ButtonPrimary
                                        type="submit"
                                        loading={isSubmitting}
                                        disabled={isSubmitting || !isValid || !dirty}
                                        fullWidth
                                    >
                                        Create my account
                                    </ButtonPrimary>
                                </div>
                            </form>
                        )}
                    </Formik>
                </div>
            </div>
        </Layout>
    );
};

export default Signup;
