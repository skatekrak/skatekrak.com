import axios, { AxiosError } from 'axios';
import classNames from 'classnames';
import validator from 'email-validator';
import React from 'react';
import { connect } from 'react-redux';
import { Field, InjectedFormProps, reduxForm, SubmissionError } from 'redux-form';

import Address from 'components/Ui/Form/Address';
import RenderInput from 'components/Ui/Form/Input';

import { savePricingCurrency } from 'store/reducers/payment';

// TODO: Find how to properly put props here (with InjectedFormProps)
interface Props {
    onSubmit: () => void;
    dispatch: (fct: any) => void;
}

type InjectedProps = InjectedFormProps<{}, Props>;

class ShippingForm extends React.Component<Props & InjectedProps> {
    public render() {
        const { handleSubmit } = this.props;
        return (
            <form id="checkout-form-shipping" className="checkout-form" onSubmit={handleSubmit(this.afterFormIsValid)}>
                <div className="row">
                    <div className="form-section col-xs-12 col-md-6">
                        <p className="form-section-title">Shipping information</p>
                        <p className="form-section-description">
                            Give us your shipping information so we can send you the best skateboard right on your
                            doorstep!
                        </p>
                        <div className="checkout-form-fields-container">
                            <Field name="email" component={RenderInput} type="email" label="Email address" />
                            <Address />
                        </div>
                    </div>
                    <div className="form-section col-xs-12 col-md-offset-1 col-md-5">
                        <button
                            className={classNames('checkout-form-submit-button', {
                                'checkout-form-submit-button--enable': !(!this.props.valid || this.props.submitting),
                            })}
                            disabled={!this.props.valid || this.props.submitting}
                        >
                            Next: Payment
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
        );
    }

    private afterFormIsValid = (values) => {
        const { email } = values;
        return axios
            .get(`${process.env.BACKEND_URL}/customers/find`, {
                params: {
                    email,
                },
            })
            .then((res) => {
                const { price, currency } = res.data;
                if (price && currency) {
                    this.props.dispatch(savePricingCurrency(price, currency));
                } else {
                    this.props.dispatch(savePricingCurrency(34800, values.country.value === 'us' ? 'usd' : 'eur'));
                }
                this.props.onSubmit();
            })
            .catch((error: AxiosError) => {
                if (error.response.status === 409) {
                    throw new SubmissionError({
                        email: 'Email is alreay taken',
                        _error: 'Failed',
                    });
                } else {
                    throw new SubmissionError({
                        _error: 'Something went wrong',
                    });
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

export default connect()(
    reduxForm({
        form: 'shipping',
        destroyOnUnmount: false,
        forceUnregisterOnUnmount: true,
        validate,
    })(ShippingForm),
);
