import Link from 'components/Link';
import validator from 'email-validator';
import Head from 'next/head';
import React from 'react';
import { connect } from 'react-redux';
import { Field, InjectedFormProps, reduxForm, SubmissionError } from 'redux-form';

import Layout from 'components/Layout/Layout';
import TrackedPage from 'components/pages/TrackedPage';
import RenderInput from 'components/Ui/Form/Input';

const LoginHead = () => (
    <Head>
        <title>Krak | Login</title>
        <meta name="description" content="Krak skateboarding club | Login to your account." />
        <meta property="og:title" content="Krak | Login" />
        <meta property="og:url" content="https://skatekrak.com/club/login" />
        <meta property="og:description" content="Krak skateboarding club | Login to your account." />
    </Head>
);

// TODO: Find how to properly put props here (with InjectedFormProps)(also in ShipmentForm)
interface Props {
    onSubmit: () => void;
    dispatch: (fct: any) => void;
}

type InjectedProps = InjectedFormProps<{}, Props>;

type State = {};

class Login extends React.PureComponent<Props & InjectedProps, State> {
    public render() {
        return (
            <TrackedPage name="Login">
                <Layout head={<LoginHead />}>
                    <div className="auth-container container-fluid">
                        <div className="auth-form-container">
                            <h1 className="auth-form-title">Enter the club</h1>
                            <p className="auth-form-desc">Welcome back Kraken!</p>
                            <form className="auth-form">
                                <Field
                                    withoutLabel
                                    name={'email'}
                                    placeholder="Email"
                                    component={RenderInput}
                                    type="text"
                                />
                                <Field
                                    withoutLabel
                                    name={'password'}
                                    placeholder="Password"
                                    component={RenderInput}
                                    type="password"
                                />
                                <div className="form-element">
                                    <label htmlFor="remember-me" className="checkbox-container">
                                        Keep me in
                                        <input type="checkbox" className="remember-me" name="remember-me" checked />
                                        <span className="checkmark" />
                                    </label>
                                </div>
                                <button className="auth-form-submit" type="submit" onClick={this.handleSubmit}>
                                    Log in
                                </button>
                            </form>
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
}

const validate = (values: any) => {
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

export default connect()(
    reduxForm({
        form: 'login',
        destroyOnUnmount: false,
        forceUnregisterOnUnmount: true,
        validate,
    })(Login),
);
