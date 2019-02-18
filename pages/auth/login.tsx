import validator from 'email-validator';
import Head from 'next/head';
import React from 'react';
import { Field as ReactField, Form } from 'react-final-form';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import Types from 'Types';

import Layout from 'components/Layout/Layout';
import Link from 'components/Link';
import TrackedPage from 'components/pages/TrackedPage';
import Field from 'components/Ui/Form/Field';

import withoutAuth from 'hocs/withoutAuth';

import { hideMessage, showAuthLoader, userSignin } from 'store/auth/actions';

const LoginHead = () => (
    <Head>
        <title>Krak | Login</title>
        <meta name="description" content="Krak skateboarding club | Login to your account." />
        <meta property="og:title" content="Krak | Login" />
        <meta property="og:url" content="https://skatekrak.com/auth/login" />
        <meta property="og:description" content="Krak skateboarding club | Login to your account." />
    </Head>
);

type Props = {
    authUser: any;
    showMessage: boolean;
    loader: boolean;

    hideMessage: () => void;
    showAuthLoader: () => void;
    userSignin: (email: string, password: string, rememberMe: boolean) => void;
};

class Login extends React.Component<Props> {
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
                                        <Field name="email" placeholder="Email" type="email" />
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
        this.props.userSignin(values.email, values.password, values.rememberMe);
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

const mapStateToProps = ({ auth }: Types.RootState) => {
    const { loader, showMessage, authUser } = auth;
    return { loader, showMessage, authUser };
};

export default compose(
    withoutAuth,
    connect(
        mapStateToProps,
        {
            hideMessage,
            showAuthLoader,
            userSignin,
        },
    ),
)(Login);
