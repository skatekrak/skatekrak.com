import { FORM_ERROR } from 'final-form';
import Head from 'next/head';
import Router, { withRouter, WithRouterProps } from 'next/router';
import React from 'react';
import { Form } from 'react-final-form';

import Layout from 'components/Layout/Layout';
import TrackedPage from 'components/pages/TrackedPage';
import ErrorMessage from 'components/Ui/Form/ErrorMessage';
import Field from 'components/Ui/Form/Field';

import { cairote } from 'lib/cairote';

const ResetHead = () => (
    <Head>
        <title>Krak | Reset</title>
        <meta property="og:title" content="Krak | Reset" />
        <meta property="og:url" content="https://skatekrak.com/auth/reset" />
    </Head>
);

type QueryProps = {
    token: string;
};

class ResetPassword extends React.Component<WithRouterProps<QueryProps>> {
    public render() {
        return (
            <TrackedPage name="Auth/ResetPassword">
                <Layout head={<ResetHead />}>
                    <div className="auth-container container-fluid">
                        <div className="auth-form-container">
                            <h1 className="auth-form-title">Reset password</h1>
                            <p className="auth-form-desc">Enter a new password</p>
                            <Form onSubmit={this.handleSubmit} validate={validate}>
                                {({ handleSubmit, submitting, submitError }) => (
                                    <form className="auth-form" onSubmit={handleSubmit}>
                                        <ErrorMessage message={submitError} />
                                        <Field name="password" placeholder="New password" type="password" />
                                        <button
                                            className="auth-form-submit button-primary"
                                            type="submit"
                                            onClick={this.handleSubmit}
                                            disabled={submitting}
                                        >
                                            Save password
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

    private handleSubmit = async (_values: any) => {
        const token = this.props.router.query.token;
        const password = _values.password;
        if (token && password) {
            try {
                await cairote.post('/reset', {
                    password,
                    resetToken: token,
                });
                Router.push('/auth/login');
            } catch (error) {
                return { [FORM_ERROR]: 'Could not reset the password' };
            }
        }
    };
}

const validate = (values: any) => {
    const errors: any = {};

    if (!values.password) {
        errors.password = 'Required';
    }

    return errors;
};

export default withRouter(ResetPassword);
