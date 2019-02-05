import validator from 'email-validator';
import Head from 'next/head';
import React from 'react';
import { Form } from 'react-final-form';

import Layout from 'components/Layout/Layout';
import Link from 'components/Link';
import TrackedPage from 'components/pages/TrackedPage';
import Field from 'components/Ui/Form/Field';

import IconArrow from 'components/Ui/Icons/Arrow';

const ForgotHead = () => (
    <Head>
        <title>Krak | Forgot</title>
        <meta property="og:title" content="Krak | Forgot" />
        <meta property="og:url" content="https://skatekrak.com/club/forgot" />
    </Head>
);

// TODO: Find how to properly put props here (with InjectedFormProps)(also in ShipmentForm)
interface Props {
    onSubmit: () => void;
    dispatch: (fct: any) => void;
}

class ForgotPassword extends React.PureComponent<Props> {
    public render() {
        return (
            <TrackedPage name="Club/ForgotPassword">
                <Layout head={<ForgotHead />}>
                    <div className="auth-container container-fluid">
                        <Link href="/club/login">
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
                                {({ handleSubmit, submitting }) => (
                                    <form className="auth-form" onSubmit={handleSubmit}>
                                        <Field withoutLabel name={'email'} placeholder="Email" type="text" />
                                        <button
                                            className="auth-form-submit button-primary"
                                            type="submit"
                                            onClick={this.handleSubmit}
                                            disabled={submitting}
                                        >
                                            Recover password
                                        </button>
                                    </form>
                                )}
                            </Form>
                        </div>
                    </div>
                </Layout>
            </TrackedPage>
        );
    }

    private handleSubmit = (evt: any) => {
        evt.preventDefault();
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

export default ForgotPassword;
