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
        <div className="w-full pt-8 pb-8 laptop-s:pt-16 container-fluid grow flex flex-col text-center text-[#EBEBEB] bg-tertiary-dark laptop-s:bg-tertiary-medium">
            <div className="grow flex flex-col tablet:grow-0 tablet:w-full tablet:max-w-[22rem] tablet:mx-auto tablet:mt-32 laptop-s:m-auto laptop-s:-translate-y-12">
                <h1 className="mb-8 font-roboto-condensed-bold text-2xl">Reset password</h1>
                {(query.token == null || query.token === '') && (
                    <p>Token is missing, open the link from the email we sent you</p>
                )}
                {query.token != null && query.token !== '' && (
                    <>
                        {success ? (
                            <div>
                                <h2 className="mb-4 text-lg">Your password has been changed!</h2>
                                <p className="text-sm text-[#999999] laptop-s:text-[#B2B2B2]">
                                    You can connect to the app with your new password
                                </p>
                            </div>
                        ) : (
                            <Formik
                                initialValues={initialValues}
                                validationSchema={ResetPasswordSchema}
                                onSubmit={onSubmit}
                            >
                                {({ errors, isSubmitting, isValid, touched }) => (
                                    <Form className="relative grow flex flex-col">
                                        <div className="flex flex-col mb-auto tablet:mb-24">
                                            <Field
                                                className="p-4 text-base text-[#EBEBEB] bg-tertiary-medium rounded laptop-s:bg-tertiary-light laptop-s:placeholder:text-[#B2B2B2] placeholder:text-[#808080]"
                                                name="password"
                                                type="password"
                                                placeholder="New password"
                                            />
                                            <ul className="mt-4 text-sm text-left text-[#808080] laptop-s:text-[#999999] [&_li]:list-inside">
                                                <li>must be at least 6 characters long</li>
                                            </ul>
                                        </div>
                                        {touched.password && errors.password != null && (
                                            <p className="absolute bottom-24 tablet:bottom-20 left-0 right-0 text-left text-system-error">
                                                {errors.password}
                                            </p>
                                        )}
                                        <ButtonPrimary
                                            type="submit"
                                            loading={isSubmitting}
                                            className="tracking-[0.75px] uppercase text-white bg-primary-80 disabled:text-[#B2B2B2] disabled:bg-tertiary-light"
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
