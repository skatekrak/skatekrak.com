import axios, { AxiosError } from 'axios';
import classNames from 'classnames';
import validator from 'email-validator';
import React from 'react';
import { Form } from 'react-final-form';

import Address from 'components/Ui/Form/Address';
import Field from 'components/Ui/Form/Field';

import { savePricingCurrency } from 'store/reducers/payment';

// TODO: Find how to properly put props here (with InjectedFormProps)(also in login)
interface Props {
    onSubmit: () => void;
}

class ShippingForm extends React.Component<Props> {
    public render() {
        return (
            <Form onSubmit={this.props.onSubmit} validate={validate}>
                {({ handleSubmit, valid, submitting }) => (
                    <form id="checkout-form-shipping" className="checkout-form" onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="form-section col-xs-12 col-md-6">
                                <p className="form-section-title">Shipping information</p>
                                <p className="form-section-description">
                                    Give us your shipping information so we can send you the best of skateboarding right
                                    on your doorstep!
                                </p>
                                <div className="checkout-form-fields-container">
                                    <Field
                                        name="email"
                                        type="email"
                                        label="Email address"
                                        autoCapitalize="none"
                                        autoCorrect="off"
                                    />
                                    <Address />
                                </div>
                            </div>
                            <div className="form-section col-xs-12 col-md-offset-1 col-md-5">
                                <button
                                    className={classNames('checkout-form-submit-button button-primary', {
                                        'checkout-form-submit-button--enable': !(!valid || submitting),
                                    })}
                                    disabled={!valid || submitting}
                                >
                                    Next
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

    private afterFormIsValid = (values) => {
        const { email } = values;
        return axios
            .get(`${process.env.BACKEND_URL}/customers/find`, {
                params: {
                    email: email.toLowerCase(),
                },
            })
            .then((res) => {
                // const { price, currency } = res.data;
                // if (price && currency) {
                //     this.props.dispatch(savePricingCurrency(price, currency));
                // } else {
                //     this.props.dispatch(savePricingCurrency(8700, values.country.value === 'us' ? 'usd' : 'eur'));
                // }
                this.props.onSubmit();
            })
            .catch((error: AxiosError) => {
                if (error.response.status === 409) {
                    return {
                        email: 'Email is alreay taken',
                        _error: 'Failed',
                    };
                } else {
                    return {
                        _error: 'Something went wrong',
                    };
                }
            });
    };
}

const validate = (values) => {
    const errors: any = {};

    if (!values.email) {
        errors.email = 'Required';
    } else if (!validator.validate(values.email)) {
        errors.email = 'This e-mail address is not valid';
    }

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

    return errors;
};

export default ShippingForm;
