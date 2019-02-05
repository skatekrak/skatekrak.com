import Head from 'next/head';
import React from 'react';
import { Form } from 'react-final-form';

import Layout from 'components/Layout/Layout';
import TrackedPage from 'components/pages/TrackedPage';
import Field from 'components/Ui/Form/Field';

const ResetHead = () => (
    <Head>
        <title>Krak | Reset</title>
        <meta property="og:title" content="Krak | Reset" />
        <meta property="og:url" content="https://skatekrak.com/club/reset" />
    </Head>
);

class ResetPassword extends React.PureComponent<{}> {
    public render() {
        return (
            <TrackedPage name="Club/ResetPassword">
                <Layout head={<ResetHead />}>
                    <div className="auth-container container-fluid">
                        <div className="auth-form-container">
                            <h1 className="auth-form-title">Reset password</h1>
                            <p className="auth-form-desc">Enter a new password</p>
                            <Form onSubmit={this.handleSubmit} validate={validate}>
                                {({ handleSubmit, submitting }) => (
                                    <form className="auth-form" onSubmit={handleSubmit}>
                                        <Field
                                            withoutLabel
                                            name="password"
                                            placeholder="New password"
                                            type="password"
                                        />
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

export default ResetPassword;
