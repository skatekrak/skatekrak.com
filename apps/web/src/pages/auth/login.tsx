import React from 'react';
import { NextPage } from 'next';
import { Formik, Field, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { isEmpty, first, shake } from 'radash';
import Feudartifice from '@/shared/feudartifice';
import Link from 'next/link';

import Layout from '@/components/Layout';
import Typography from '@/components/Ui/typography/Typography';
import ButtonPrimary from '@/components/Ui/Button/ButtonPrimary/ButtonPrimary';
import Emoji from '@/components/Ui/Icons/Emoji';
import IconLike from '@/components/Ui/Icons/IconLike';

import { CarrelageAPIError } from '@/shared/feudartifice/types';
import { useRouter } from 'next/router';
import useSession from '@/lib/hook/carrelage/use-session';
import { AxiosError } from 'axios';

type LoginFormValues = {
    username: string;
    password: string;
    remember: boolean;
};

const LoginFormSchema = Yup.object().shape({
    username: Yup.string().required('Username cannot be empty').default(''),
    password: Yup.string().required('Password cannot be empty').default(''),
    remember: Yup.boolean().default(false),
});

const Login: NextPage = () => {
    const router = useRouter();
    const { isSuccess: gotSession } = useSession();

    if (gotSession) {
        router.push('/');
    }

    const onSubmit = async (values: LoginFormValues, helpers: FormikHelpers<LoginFormValues>) => {
        try {
            await Feudartifice.auth.login({
                username: values.username,
                password: values.password,
                rememberMe: values.remember,
            });
            router.push('/');
        } catch (err) {
            if (err instanceof AxiosError) {
                console.log(JSON.stringify(err.response, undefined, 2));
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
                    <Formik
                        initialValues={{ username: '', password: '', remember: false }}
                        onSubmit={onSubmit}
                        validationSchema={LoginFormSchema}
                    >
                        {({ errors, isSubmitting, handleSubmit, isValid, dirty, touched }) => (
                            <form onSubmit={handleSubmit}>
                                {/* Login inputs */}
                                <div className="relative flex items-center mb-4 bg-tertiary-medium rounded overflow-hidden last:mb-0 [&_input]:w-full [&_input]:p-4 [&_input]:text-base [&_input]:text-onDark-highEmphasis [&_input]:bg-tertiary-medium [&_input]:outline-none [&_.emoji]:shrink-0 [&_.emoji]:w-4 [&_.emoji]:ml-4 [&_.emoji]:text-onDark-mediumEmphasis">
                                    <Emoji label="username" symbol="@" />
                                    <Field name="username" type="username" placeholder="Username" />
                                </div>
                                <div className="relative flex items-center mb-4 bg-tertiary-medium rounded overflow-hidden last:mb-0 [&_input]:w-full [&_input]:p-4 [&_input]:text-base [&_input]:text-onDark-highEmphasis [&_input]:bg-tertiary-medium [&_input]:outline-none [&_.emoji]:shrink-0 [&_.emoji]:w-4 [&_.emoji]:ml-4 [&_.emoji]:text-onDark-mediumEmphasis">
                                    <Emoji label="password" symbol="🔒" />
                                    <Field name="password" type="password" placeholder="Password" />
                                </div>

                                {/* Remember & Forgot */}
                                <div className="flex items-center text-onDark-lowEmphasis">
                                    <label className="flex items-center mr-auto [&_input[type='checkbox']]:appearance-none [&_input[type='checkbox']]:grid [&_input[type='checkbox']]:place-content-center [&_input[type='checkbox']]:bg-inherit [&_input[type='checkbox']]:m-0 [&_input[type='checkbox']]:mr-2 [&_input[type='checkbox']]:font-[inherit] [&_input[type='checkbox']]:text-current [&_input[type='checkbox']]:w-3.5 [&_input[type='checkbox']]:h-3.5 [&_input[type='checkbox']]:border [&_input[type='checkbox']]:border-current [&_input[type='checkbox']]:rounded-full [&_input[type='checkbox']]:cursor-pointer [&_input[type='checkbox']]:before:content-[''] [&_input[type='checkbox']]:before:w-[0.35rem] [&_input[type='checkbox']]:before:h-[0.35rem] [&_input[type='checkbox']]:before:scale-0 [&_input[type='checkbox']]:before:transition-transform [&_input[type='checkbox']]:before:duration-75 [&_input[type='checkbox']]:before:ease-in-out [&_input[type='checkbox']]:before:bg-onDark-mediumEmphasis [&_input[type='checkbox']]:before:rounded-full [&_input[type='checkbox']:checked]:before:scale-100">
                                        <Field name="remember" type="checkbox" />
                                        <Typography as="span" component="body2">
                                            Remember me
                                        </Typography>
                                    </label>

                                    <Link href="/auth/forgot-password" className="underline cursor-pointer">
                                        <Typography component="body2">Forgot your password?</Typography>
                                    </Link>
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
                                        Login
                                    </ButtonPrimary>
                                </div>

                                {/* Sign up */}
                                <div className="mt-16 text-center text-onDark-highEmphasis [&_.ui-Typography:nth-child(2)]:my-3 [&_.ui-Typography:nth-child(2)]:mb-6 [&_.ui-Typography:nth-child(2)]:text-onDark-mediumEmphasis">
                                    <Typography component="subtitle1">Don't have an account yet?</Typography>
                                    <Typography component="body2">
                                        Sign up to access all the skatespot map features, some custom maps, and our
                                        private discord server.
                                    </Typography>

                                    <Link
                                        href="/auth/signup"
                                        className="inline-flex items-center justify-center py-3 px-8 text-onDark-highEmphasis bg-primary-80 rounded transition-all duration-200 hover:bg-primary-100"
                                    >
                                        <Typography component="button">Create my account</Typography>
                                    </Link>
                                </div>
                            </form>
                        )}
                    </Formik>
                </div>
            </div>
        </Layout>
    );
};

export default Login;
