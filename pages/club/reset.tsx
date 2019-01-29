import Head from 'next/head';
import React from 'react';
import { connect } from 'react-redux';
import { Field, InjectedFormProps, reduxForm, SubmissionError } from 'redux-form';

import Layout from 'components/Layout/Layout';
import RenderInput from 'components/Ui/Form/Input';

const ResetHead = () => (
    <Head>
        <title>Krak | Reset</title>
        <meta property="og:title" content="Krak | Reset" />
        <meta property="og:url" content="https://skatekrak.com/club/reset" />
    </Head>
);

// TODO: Find how to properly put props here (with InjectedFormProps)(also in ShipmentForm)
interface Props {
    onSubmit: () => void;
    dispatch: (fct: any) => void;
}

type InjectedProps = InjectedFormProps<{}, Props>;

type State = {};

class ResetPassword extends React.PureComponent<Props & InjectedProps, State> {
    public render() {
        return (
            <Layout head={<ResetHead />}>
                <div className="auth-container container-fluid">
                    <div className="auth-form-container">
                        <h1 className="auth-form-title">Reset password</h1>
                        <p className="auth-form-desc">Enter a new password</p>
                        <form className="auth-form">
                            <Field
                                withoutLabel
                                name={'password'}
                                placeholder="New password"
                                component={RenderInput}
                                type="password"
                            />
                            <button
                                className="auth-form-submit button-primary"
                                type="submit"
                                onClick={this.handleSubmit}
                            >
                                Save password
                            </button>
                        </form>
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

    if (!values.password) {
        errors.password = 'Required';
    }

    return errors;
};

export default connect()(
    reduxForm({
        form: 'reset',
        destroyOnUnmount: false,
        forceUnregisterOnUnmount: true,
        validate,
    })(ResetPassword),
);
