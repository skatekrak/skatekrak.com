import axios, { AxiosError } from 'axios';
import Router from 'next/router';
import React from 'react';
import { connect } from 'react-redux';
import { injectStripe, ReactStripeElements } from 'react-stripe-elements';
import { formValueSelector, reset } from 'redux-form';

import analytics from '@krak/analytics';

import PaymentForm from 'components/pages/club/PaymentForm';
import ShippingForm from 'components/pages/club/ShippingForm';

type Props = {
    email?: string;
    code?: string;
    shippingAddress?: any;
    billingAddress?: any;
    dispatch: (...arg: any) => void;
    payment: {
        price: number;
        currency: number;
    };
};

type State = {
    step: 'shipping' | 'payment' | 'done';
    stripeError?: string;
};

class Checkout extends React.Component<Props & ReactStripeElements.InjectedStripeProps, State> {
    public state: State = {
        step: 'shipping',
        stripeError: null,
    };

    public render() {
        const { step, stripeError } = this.state;
        return (
            <main id="checkout-main">
                {step === 'payment' && (
                    <button id="checkout-main-back-to-shipping" onClick={this.previousPage}>
                        Back to shipping information
                    </button>
                )}
                {step === 'shipping' && <ShippingForm onSubmit={this.nextPage} />}
                {step === 'payment' && <PaymentForm stripeError={stripeError} onSubmit={this.handlePayment} />}
            </main>
        );
    }

    private nextPage = () => {
        this.setState({ step: 'payment' });
    };

    private previousPage = () => {
        this.setState({ step: 'shipping' });
    };

    private handlePayment = () => {
        analytics.trackEvent('Click', 'pay', {
            name: 'price',
            value: this.props.payment.price,
        });

        const { email, code, shippingAddress } = this.props;
        let { billingAddress } = this.props;

        if (billingAddress && !billingAddress.firstName) {
            billingAddress = null;
        }

        shippingAddress.country = shippingAddress.country.value;

        if (!billingAddress) {
            billingAddress = shippingAddress;
        } else {
            billingAddress.country = billingAddress.country.value;
        }

        return this.props.stripe
            .createToken({
                name: `${billingAddress.firstName} ${billingAddress.lastName}`,
                address_line1: billingAddress.line1,
                address_line2: billingAddress.line2,
                address_city: billingAddress.city,
                address_zip: billingAddress.postalcode,
                address_state: billingAddress.state,
                address_country: billingAddress.country,
            })
            .then((payload) => {
                if (payload.error) {
                    this.setState({ stripeError: payload.error.message });
                } else {
                    return axios
                        .post(`${process.env.BACKEND_URL}/payments/pay`, {
                            email,
                            shippingAddress,
                            billingAddress,
                            token: payload.token.id,
                            code,
                        })
                        .then(() => {
                            analytics.trackOrder(payload.token.id, this.props.payment.price / 100);
                            this.props.dispatch(reset('shipping'));
                            this.props.dispatch(reset('payment'));
                            Router.push('/club/congrats');
                        })
                        .catch((err: AxiosError) => {
                            this.setState({ stripeError: err.response.data.message });
                        });
                }
            });
    };
}

const shippingSelector = formValueSelector('shipping');
const paymentSelector = formValueSelector('payment');

export default connect((state: any) => ({
    email: shippingSelector(state, 'email'),
    code: paymentSelector(state, 'code'),
    shippingAddress: {
        firstName: shippingSelector(state, 'firstName'),
        lastName: shippingSelector(state, 'lastName'),
        line1: shippingSelector(state, 'line1'),
        line2: shippingSelector(state, 'line2'),
        city: shippingSelector(state, 'city'),
        postalCode: shippingSelector(state, 'postalcode'),
        state: shippingSelector(state, 'state'),
        country: shippingSelector(state, 'country'),
    },
    billingAddress: {
        firstName: paymentSelector(state, 'firstName'),
        lastName: paymentSelector(state, 'lastName'),
        line1: paymentSelector(state, 'line1'),
        line2: paymentSelector(state, 'line2'),
        city: paymentSelector(state, 'city'),
        postalCode: paymentSelector(state, 'postalcode'),
        state: paymentSelector(state, 'state'),
        country: paymentSelector(state, 'country'),
    },
    payment: state.payment,
}))(injectStripe(Checkout));
