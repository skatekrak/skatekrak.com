import { AxiosError } from 'axios';
import validator from 'email-validator';
import { FORM_ERROR } from 'final-form';
import React from 'react';
import { Form, FormSpy } from 'react-final-form';
import { connect } from 'react-redux';

import Types from 'Types';

import ErrorMessage from 'components/Ui/Form/ErrorMessage';
import Field from 'components/Ui/Form/Field';

import { cairote } from 'lib/cairote';
import { updateFormState } from 'store/form/actions';

type Props = {
    quarterFull: boolean;
    onNextClick: () => void;
    updateFormState: (form, state) => void;
    payment: {
        price: number;
        currency: string;
    };
};

class CreateAccount extends React.Component<Props> {
    public render() {
        const { quarterFull, payment } = this.props;
        return (
            <Form onSubmit={this.handleSubmit} validate={validateForm}>
                {({ handleSubmit, submitting, submitError }) => (
                    <form className="subscribe modal-two-col-container modal-two-col-form" onSubmit={handleSubmit}>
                        <FormSpy onChange={this.onFormChange} />
                        <div className="modal-two-col-first-container">
                            <article id="subscribe-promote">
                                <header id="subscribe-promote-header">
                                    <p id="subscribe-promote-header-join">Join the club</p>
                                    <h2 id="subscribe-promote-header-title">Krak Skate Club</h2>
                                    <h3 id="subscribe-promote-header-subtitle">- Quarterly membership -</h3>
                                </header>
                                <main id="subscribe-promote-main">
                                    <p id="subscribe-promote-main-price">
                                        {this.getPricingText(String(payment.price / 100))} today
                                    </p>
                                    {!quarterFull ? (
                                        <>
                                            <p id="subscribe-promote-main-cover">to be covered until April 4th 2019</p>
                                        </>
                                    ) : (
                                        <>
                                            <p id="subscribe-promote-main-cover">
                                                to guarantee your slot for the next quarter
                                            </p>
                                            <p id="subscribe-promote-main-cover">from April 5th to July 4th 2019</p>
                                        </>
                                    )}
                                </main>
                                <footer id="subscribe-promote-footer">
                                    <p id="subscribe-promote-footer-limited">
                                        Limited quantities available.
                                        <br />
                                        First come first served.
                                    </p>
                                </footer>
                            </article>
                        </div>
                        <div className="modal-two-col-second-container modal-two-col-item-container">
                            <h1 className="modal-two-col-title">
                                Create
                                <br />
                                your account
                            </h1>
                            <div className="modal-two-col-content">
                                <p className="modal-two-col-content-description">
                                    {!quarterFull
                                        ? 'Become a Kraken.'
                                        : 'Be sure to become a Kraken on April 5th 2019.'}
                                </p>
                                <div className="form-double-field-line">
                                    <Field name="firstName" placeholder="First name" />
                                    <Field name="lastName" placeholder="Last name" />
                                </div>
                                <Field name="email" placeholder="Email" />
                                <Field name="password" placeholder="Password" type="password" />
                            </div>
                            <ErrorMessage message={submitError} />
                            <button
                                type="submit"
                                className="button-primary modal-two-col-form-submit"
                                disabled={submitting}
                            >
                                {!quarterFull ? 'Become a Kraken' : 'Pre-pay'}
                            </button>
                        </div>
                    </form>
                )}
            </Form>
        );
    }

    private handleSubmit = async (values: any) => {
        try {
            await cairote.get('/check-email', {
                params: { email: values.email },
            });
            return { email: 'This email is already in use' };
        } catch (error) {
            const err = error as AxiosError;
            if (err.response.status === 404) {
                this.props.onNextClick();
            } else {
                return { [FORM_ERROR]: 'Oops, something went wront, try later or contact us' };
            }
        }
    };

    private getPricingText(price: string): string {
        const { payment } = this.props;
        let res = '';
        if (payment.currency === 'usd') {
            res += '$';
        }
        if (payment.currency === 'gbp') {
            res += '£';
        }
        res += price;
        if (payment.currency === 'eur') {
            res += '€';
        }
        return res;
    }

    private onFormChange = (state) => {
        this.props.updateFormState('account', state.values);
    };
}

const validateForm = (values: any) => {
    const errors: any = {};

    if (!values.firstName) {
        errors.firstName = 'Required';
    }

    if (!values.lastName) {
        errors.lastName = 'Required';
    }

    if (!values.email) {
        errors.email = 'Required';
    } else if (!validator.validate(values.email)) {
        errors.email = 'Not a valid email';
    }

    if (!values.password) {
        errors.password = 'Required';
    }

    return errors;
};

const mapStateToProps = ({ payment }: Types.RootState) => {
    return { payment };
};

export default connect(
    mapStateToProps,
    {
        updateFormState,
    },
)(CreateAccount);
