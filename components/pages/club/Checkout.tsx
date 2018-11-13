import React from 'react';
import { connect } from 'react-redux';
import { injectStripe, ReactStripeElements } from 'react-stripe-elements';
import { formValueSelector, SubmissionError } from 'redux-form';

import PaymentForm from 'components/pages/club/PaymentForm';
import ShippingForm from 'components/pages/club/ShippingForm';

type State = {
    step: 'shipping' | 'payment' | 'done';
    stripe?: any;
    stripeError?: string;
};

class Checkout extends React.Component<ReactStripeElements.InjectedStripeProps, State> {
    public state: State = {
        step: 'shipping',
        stripe: null,
        stripeError: null,
    };

    public componentDidMount() {
        this.setState({
            stripe: (window as any).Stripe(process.env.STRIPE_KEY),
        });
    }

    public render() {
        const { step, stripeError } = this.state;
        return (
            <main id="checkout-main">
                {step === 'shipping' && <ShippingForm onSubmit={this.nextPage} />}
                {step === 'payment' && <PaymentForm stripeError={stripeError} onSubmit={this.handlePayment} />}
            </main>
        );
    }

    private nextPage = () => {
        this.setState({ step: 'payment' });
    };

    private handlePayment = () => {
        return this.props.stripe
            .createToken({
                name: 'Maxime Cattet',
            })
            .then((payload) => {
                if (payload.error) {
                    this.setState({ stripeError: payload.error.message });
                }
            });
    };
}

const shippingSelector = formValueSelector('shipping');
const paymentSelector = formValueSelector('payment');

export default connect((state) => ({
    email: shippingSelector(state, 'email'),
    shippingAddress: {
        firstName: shippingSelector(state, 'firstName'),
        lastName: shippingSelector(state, 'lastName'),
        line1: shippingSelector(state, 'line1'),
        line2: shippingSelector(state, 'line2'),
        city: shippingSelector(state, 'city'),
        postalCode: shippingSelector(state, 'postalcode'),
        country: shippingSelector(state, 'country'),
    },
    billingAddress: {
        firstName: paymentSelector(state, 'firstName'),
        lastName: paymentSelector(state, 'lastName'),
        line1: paymentSelector(state, 'line1'),
        line2: paymentSelector(state, 'line2'),
        city: paymentSelector(state, 'city'),
        postalCode: paymentSelector(state, 'postalcode'),
        country: paymentSelector(state, 'country'),
    },
}))(injectStripe(Checkout));
