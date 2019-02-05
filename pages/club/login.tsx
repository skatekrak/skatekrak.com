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
        <meta property="og:url" content="https://skatekrak.com/club/login" />
        <meta property="og:description" content="Krak skateboarding club | Login to your account." />
    </Head>
);

type Props = {
    onSubmit: () => void;
    dispatch: (fct: any) => void;
};

type State = {};

class Login extends React.PureComponent<Props, State> {
    public render() {
        return (
            <TrackedPage name="Club/Login">
                <Layout head={<LoginHead />}>
                    <div className="auth-container container-fluid">
                        <div className="auth-form-container">
                            <h1 className="auth-form-title">Enter the club</h1>
                            <p className="auth-form-desc">Welcome back Kraken!</p>
                            <Form onSubmit={this.handleSubmit} validate={this.validate}>
                                {({ handleSubmit }) => (
                                    <form onSubmit={handleSubmit} className="auth-form">
                                        <Field withoutLabel name="email" placeholder="Email" />
                                        <Field withoutLabel name="password" placeholder="Password" type="password" />
                                        <div className="form-element">
                                            <label htmlFor="remember-me" className="checkbox-container">
                                                Keep me in
                                                <ReactField name="rememberMe">
                                                    {({ input }) => (
                                                        <input
                                                            {...input}
                                                            type="checkbox"
                                                            className="remember-me"
                                                            defaultChecked={true}
                                                        />
                                                    )}
                                                </ReactField>
                                                <span className="checkmark" />
                                            </label>
                                        </div>
                                        <button className="auth-form-submit button-primary" type="submit">
                                            Log in
                                        </button>
                                    </form>
                                )}
                            </Form>
                            <div className="auth-link-container">
                                <Link href="/club">
                                    <a>Join the club</a>
                                </Link>
                                <Link href="/club/forgot">
                                    <a>Password?</a>
                                </Link>
                            </div>
                        </div>
                    </div>
                </Layout>
            </TrackedPage>
        );
    }

    private handleSubmit = (evt: any) => {
        evt.preventDefault();
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
