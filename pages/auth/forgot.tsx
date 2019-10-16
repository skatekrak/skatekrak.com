import validator from 'email-validator';
import { FORM_ERROR } from 'final-form';
import getConfig from 'next/config';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import { Form } from 'react-final-form';

import Layout from 'components/Layout/Layout';
import TrackedPage from 'components/pages/TrackedPage';
import ErrorMessage from 'components/Ui/Form/ErrorMessage';
import Field from 'components/Ui/Form/Field';
import IconArrow from 'components/Ui/Icons/Arrow';

import withoutAuth from 'hocs/withoutAuth';
import { cairote } from 'lib/cairote';

const ForgotHead = () => (
    <Head>
        <title>Krak | Forgot</title>
        <meta property="og:title" content="Krak | Forgot" />
        <meta property="og:url" content={`${getConfig().publicRuntimeConfig.WEBSITE_URL}/auth/forgot`} />
    </Head>
);

class ForgotPassword extends React.Component {
    public render() {
        return (
            <TrackedPage name="auth/ForgotPassword">
                <Layout head={<ForgotHead />}>
                    <div className="auth-container container-fluid">
                        <Link href="/auth/login">
                            <a className="auth-back">
                                <IconArrow />
                                Back to login
                            </a>
                        </Link>
                        <div className="auth-form-container">
                            <h1 className="auth-form-title">Forgot password</h1>
                            <p className="auth-form-desc">
                                Enter your email address below and we'll send you a link to reset your password.
                            </p>
                            <Form onSubmit={this.handleSubmit} validate={validate}>
                                {({ handleSubmit, submitting, valid, submitError }) => (
                                    <>
                                        {submitError && <ErrorMessage message={submitError} />}
                                        <form className="auth-form" onSubmit={handleSubmit}>
                                            <Field name="email" placeholder="Email" type="text" />
                                            <button
                                                className="auth-form-submit button-primary"
                                                type="submit"
                                                onClick={this.handleSubmit}
                                                disabled={submitting || !valid}
                                            >
                                                Recover password
                                            </button>
                                        </form>
                                    </>
                                )}
                            </Form>
                        </div>
                    </div>
                </Layout>
            </TrackedPage>
        );
    }

    private handleSubmit = async (values: any) => {
        try {
            if (values.email) {
                values.email = values.email.toLowerCase();
            }
            await cairote.post('/forgot', { email: values.email });
            alert('Email sent!');
        } catch (error) {
            return { [FORM_ERROR]: 'Something went wrong, try later or contact us' };
        }
    };
}

const validate = (values: any) => {
    const errors: any = {};

    if (!values.email) {
        errors.email = 'Required';
    } else if (!validator.validate(values.email)) {
        errors.email = 'This e-mail address is not valid';
    }

    return errors;
};

export default withoutAuth(ForgotPassword);
