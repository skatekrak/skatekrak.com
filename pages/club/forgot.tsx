import validator from 'email-validator';
import Head from 'next/head';
import React from 'react';
import { connect } from 'react-redux';
import { Field, InjectedFormProps, reduxForm, SubmissionError } from 'redux-form';

import Layout from 'components/Layout/Layout';
import Link from 'components/Link';
import TrackedPage from 'components/pages/TrackedPage';
import RenderInput from 'components/Ui/Form/Input';

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

type InjectedProps = InjectedFormProps<{}, Props>;

type State = {};

class ForgotPassword extends React.PureComponent<Props & InjectedProps, State> {
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
                            <form className="auth-form">
                                <Field
                                    withoutLabel
                                    name={'email'}
                                    placeholder="Email"
                                    component={RenderInput}
                                    type="text"
                                />
                                <button
                                    className="auth-form-submit button-primary"
                                    type="submit"
                                    onClick={this.handleSubmit}
                                >
                                    Recover password
                                </button>
                            </form>
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

export default connect()(
    reduxForm({
        form: 'forgot',
        destroyOnUnmount: false,
        forceUnregisterOnUnmount: true,
        validate,
    })(ForgotPassword),
);
