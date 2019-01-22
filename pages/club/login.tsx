import validator from 'email-validator';
import Head from 'next/head';
import React from 'react';
import { connect } from 'react-redux';
import { Field, InjectedFormProps, reduxForm, SubmissionError } from 'redux-form';

import Layout from 'components/Layout/Layout';
import RenderInput from 'components/Ui/Form/Input';
import { State as SettingState } from 'store/reducers/setting';

import IconArrow from 'components/Ui/Icons/Arrow';
import IconCross from 'components/Ui/Icons/Cross';

// TODO: Find how to properly put props here (with InjectedFormProps)(also in ShipmentForm)
interface Props {
    setting: SettingState;
    onSubmit: () => void;
    dispatch: (fct: any) => void;
}

type InjectedProps = InjectedFormProps<{}, Props>;

type State = {};

const LoginHead = () => (
    <Head>
        <title>Krak | Login</title>
        <meta name="description" content="Krak skateboarding club | Login to your account." />
        <meta property="og:title" content="Krak | Login" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://skatekrak.com/club/login" />
        <meta property="og:image" content="https://skatekrak.com/static/images/og-club.jpg" />
        <meta property="og:description" content="Krak skateboarding club | Login to your account." />
        <link href="https://fonts.googleapis.com/css?family=Permanent+Marker" rel="stylesheet" />
    </Head>
);

class Login extends React.PureComponent<Props & InjectedProps, State> {
    public render() {
        return (
            <Layout head={<LoginHead />}>
                <div className="auth-container container-fluid">
                    {this.props.setting.isMobile ? (
                        <span className="auth-back">
                            <IconArrow />
                            Back
                        </span>
                    ) : (
                        <span className="auth-close">
                            <IconCross />
                        </span>
                    )}
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
                            <a href="/club">Join the club</a>
                            <a href="/forgot">Password?</a>
                        </div>
                    </div>
                </div>
            </Layout>
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

export default connect((state: any) => ({ setting: state.setting }))(
    reduxForm({
        form: 'login',
        destroyOnUnmount: false,
        forceUnregisterOnUnmount: true,
        validate,
    })(Login),
);
