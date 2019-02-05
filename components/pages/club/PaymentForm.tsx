import axios, { AxiosError } from 'axios';
import classNames from 'classnames';
import React from 'react';
import { Form } from 'react-final-form';
import { connect } from 'react-redux';
import { CardElement } from 'react-stripe-elements';

import Address from 'components/Ui/Form/Address';
import FormElement from 'components/Ui/Form/Element';
import ErrorMessage from 'components/Ui/Form/ErrorMessage';

import Field from 'components/Ui/Form/Field';

type Props = {
    payment: {
        price: number;
        currency: string;
    };
    stripeError?: string;
    onSubmit: () => void;
};

type State = {
    showBilling: boolean;
};

class PaymentForm extends React.Component<Props, State> {
    public state: State = {
        showBilling: false,
    };

    public render() {
        const { stripeError, onSubmit } = this.props;
        return (
            <Form onSubmit={onSubmit} validate={validate}>
                {({ handleSubmit, submitting, valid }) => (
                    <form id="checkout-form-payment" className="checkout-form" onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="form-section col-xs-12 col-md-6">
                                <p className="form-section-title">Payment information</p>
                                <div className="checkout-form-fields-container">
                                    <div className="form-element">
                                        <FormElement label="Card details" invalid={stripeError === undefined}>
                                            <>
                                                <CardElement />
                                                {stripeError && <ErrorMessage message={stripeError} />}
                                            </>
                                        </FormElement>
                                    </div>
                                    <div className="form-element">
                                        <Field name="code" type="text" label="Specials (optional)" showValid />
                                    </div>
                                    <div className="form-element">
                                        <div className="form-element-field">
                                            <label htmlFor="acceptRenew" className="checkbox-container">
                                                I understand & accept that my membership will be automatically renewed
                                                on{' '}
                                                {this.props.payment.price === 8700 ? (
                                                    <span>April 5th 2019</span>
                                                ) : (
                                                    <span>January 5th 2020</span>
                                                )}
                                                <Field
                                                    name="acceptRenew"
                                                    id="acceptRenew"
                                                    component="input"
                                                    type="checkbox"
                                                />
                                                <span className="checkmark" />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="form-element">
                                        <div className="form-element-field">
                                            <label htmlFor="show-billing" className="checkbox-container">
                                                Use shipping address as billing address
                                                <input
                                                    type="checkbox"
                                                    id="show-billing"
                                                    name="show-billing"
                                                    checked={!this.state.showBilling}
                                                    onChange={this.toggleBillingInfo}
                                                />
                                                <span className="checkmark" />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                {this.state.showBilling && (
                                    <>
                                        <p className="form-section-title">Billings information</p>
                                        <div className="checkout-form-fields-container">
                                            <Address />
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="form-section col-xs-12 col-md-offset-1 col-md-5">
                                <button
                                    className={classNames('checkout-form-submit-button button-primary', {
                                        'checkout-form-submit-button--enable': !(!valid || submitting),
                                    })}
                                    disabled={!valid || submitting}
                                >
                                    Pay {this.props.payment.currency === 'usd' && '$'}
                                    {this.props.payment.currency === 'gbp' && '£'}
                                    {this.props.payment.price / 100}
                                    {this.props.payment.currency === 'eur' && '€'}
                                </button>
                                <div id="checkout-contact">
                                    <h4 id="checkout-contact-title">Questions?</h4>
                                    <p>
                                        Contact our support team at{' '}
                                        <a id="checkout-contact-mail" href="mailto:club@skatekrak.com">
                                            club@skatekrak.com
                                        </a>
                                    </p>
                                </div>
                                <img
                                    className="checkout-form-img"
                                    src="/static/images/step_1_2x.png"
                                    alt="Kraken illustration step 1"
                                />
                            </div>
                        </div>
                    </form>
                )}
            </Form>
        );
    }

    private toggleBillingInfo = (event) => {
        this.setState({ showBilling: !event.target.checked });
    };
}

const validate = (values) => {
    const errors: any = {};

    if (!values.firstName) {
        errors.firstName = 'Required';
    }

    if (!values.lastName) {
        errors.lastName = 'Required';
    }

    if (!values.line1) {
        errors.line1 = 'Required';
    }

    if (!values.city) {
        errors.city = 'Required';
    }

    if (!values.postalcode) {
        errors.postalcode = 'Required';
    }

    if (!values.state) {
        errors.state = 'Required';
    }

    if (!values.country) {
        errors.country = 'Required';
    }

    if (!values.acceptRenew) {
        errors.acceptRenew = 'Required';
    }

    return errors;
};

const asyncValidate = (values) => {
    if (values.code) {
        return axios
            .get(`${process.env.BACKEND_URL}/specials/check`, {
                params: {
                    code: values.code,
                },
            })
            .catch((error: AxiosError) => {
                throw { code: error.response.data.message };
            });
    }
    return Promise.resolve();
};

export default connect((state: any) => ({
    payment: state.payment,
}))(PaymentForm);
