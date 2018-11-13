import classNames from 'classnames';
import validator from 'email-validator';
import * as React from 'react';
import { Field, InjectedFormProps, reduxForm } from 'redux-form';

import Layout from 'components/Layout/Layout';
import 'static/styles/checkout.styl';

import Address from 'components/Ui/Form/Address';
import RenderInput from 'components/Ui/Form/Input';

const countriesOptions = [
    {
        value: 'pt',
        label: 'Portugal',
    },
    {
        value: 'fr',
        label: 'France',
    },
    {
        value: 'es',
        label: 'Spain',
    },
    {
        value: 'us',
        label: 'United States',
    },
    {
        value: 'at',
        label: 'Austria',
    },
    {
        value: 'be',
        label: 'Belgium',
    },
    {
        value: 'ch',
        label: 'Switzerland',
    },
    {
        value: 'de',
        label: 'Germany',
    },
    {
        value: 'gb',
        label: 'United Kingdom',
    },
    {
        value: 'ie',
        label: 'Ireland',
    },
    {
        value: 'it',
        label: 'Italy',
    },
    {
        value: 'lu',
        label: 'Luxembourg',
    },
    {
        value: 'nl',
        label: 'Netherlands',
    },
];

type State = {
    form: {
        email: string;
        address: {
            firstName: string;
            lastName: string;
            line1: string;
            line2?: string;
            city: string;
            zipcode: string;
            country: string;
        };
    };
};

const validate = (values) => {
    const errors: any = {};

    if (!values.email) {
        errors.email = 'Required';
    } else if (!validator.validate(values.email)) {
        errors.email = 'Email not valid';
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

    if (!values.country) {
        errors.country = 'Required';
    }

    return errors;
};

class Club extends React.Component<InjectedFormProps, State> {
    public render() {
        const { handleSubmit, valid, submitting } = this.props;
        return (
            <Layout>
                <div id="checkout" className="container">
                    <header id="checkout-header">
                        <h1 id="checkout-header-title">Join the club</h1>
                        <h2 id="checkout-header-subtitle">Krak Skateboarding Club - 12 month membership</h2>
                        <div id="checkout-header-price-container">
                            <p id="checkout-header-price">$348 today</p>
                            <p id="checkout-header-price-details">to be covered until December 2019</p>
                        </div>
                    </header>
                    <main id="checkout-main">
                        <form
                            id="checkout-form-shipping"
                            className="checkout-form"
                            onSubmit={handleSubmit(this.doSomethingAfterFormIsValid)}
                        >
                            <div className="row">
                                <div className="form-section col-xs-12 col-md-6">
                                    <p className="form-section-title">Shipping information</p>
                                    <p className="form-section-description">
                                        Give us your shipping information so we can send you the best skateboard right
                                        on your doorstep!
                                    </p>
                                    <div className="checkout-form-fields-container">
                                        <Field
                                            name="email"
                                            component={RenderInput}
                                            type="email"
                                            placeholder="jean@skatekrak.com"
                                            label="Email address"
                                        />
                                        <Address countries={countriesOptions} />
                                    </div>
                                </div>
                                <div className="form-section col-xs-12 col-md-offset-1 col-md-5">
                                    <button
                                        className={classNames('checkout-form-submit-button', {
                                            'checkout-form-submit-button--enable': valid || submitting,
                                        })}
                                        disabled={!valid && !submitting}
                                    >
                                        Payment
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
                                        src="static/images/step_1_2x.png"
                                        alt="Kraken illustration step 1"
                                    />
                                </div>
                            </div>
                        </form>
                    </main>
                </div>
            </Layout>
        );
    }

    private doSomethingAfterFormIsValid = (values) => {
        window.alert(JSON.stringify(values, null, 2));
    };
}

export default reduxForm({
    form: 'shipping',
    destroyOnUnmount: false,
    validate,
})(Club);
