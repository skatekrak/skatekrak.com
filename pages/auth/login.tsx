import Link from 'components/Link';
import validator from 'email-validator';
import Head from 'next/head';
import React from 'react';
import { Field as ReactField, Form } from 'react-final-form';

import Layout from 'components/Layout/Layout';
import TrackedPage from 'components/pages/TrackedPage';
import Field from 'components/Ui/Form/Field';

const LoginHead = () => (
    <Head>
        <title>Krak | Login</title>
        <meta name="description" content="Krak skateboarding club | Login to your account." />
        <meta property="og:title" content="Krak | Login" />
        <meta property="og:url" content="https://skatekrak.com/auth/login" />
        <meta property="og:description" content="Krak skateboarding club | Login to your account." />
    </Head>
);

class Login extends React.PureComponent<{}> {
    public render() {
        return (
            <TrackedPage name="Auth/Login">
                <Layout head={<LoginHead />}>
                    <div className="auth-container container-fluid">
                        <div className="auth-form-container">
                            <h1 className="auth-form-title">Enter the club</h1>
                            <p className="auth-form-desc">Welcome back Kraken!</p>
                            <Form
                                onSubmit={this.handleSubmit}
                                validate={this.validate}
                                initialValues={{ rememberMe: true }}
                            >
                                {({ handleSubmit, submitting, valid }) => (
                                    <form onSubmit={handleSubmit} className="auth-form">
                                        <Field name="email" placeholder="Email" />
                                        <Field name="password" placeholder="Password" type="password" />
                                        <div className="form-element">
                                            <label htmlFor="rememberMe" className="checkbox-container">
                                                Keep me in
                                                <ReactField
                                                    id="rememberMe"
                                                    name="rememberMe"
                                                    type="checkbox"
                                                    className="remember-me"
                                                    component="input"
                                                />
                                                <span className="checkmark" />
                                            </label>
                                        </div>
                                        <button
                                            className="auth-form-submit button-primary"
                                            type="submit"
                                            disabled={submitting || !valid}
                                        >
                                            Log in
                                        </button>
                                    </form>
                                )}
                            </Form>
                            <div className="auth-link-container">
                                <Link href="/club">
                                    <a>Join the club</a>
                                </Link>
                                <Link href="/auth/forgot">
                                    <a>Password?</a>
                                </Link>
                            </div>
                        </div>
                    </div>
                </Layout>
            </TrackedPage>
        );
    }

    private handleSubmit = (values: any) => {
        // POST query to login
    };

    private validate = (values: any) => {
        const errors: any = {};

        if (!values.email) {
            errors.email = 'Required';
        } else if (!validator.validate(values.email)) {
            errors.email = 'This e-mail address is not valid';
        }

        if (!values.password) {
            errors.password = 'Required';
        }

        return errors;
    };
}

export default Login;
