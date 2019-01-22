import React from 'react';
import { connect } from 'react-redux';
import { Elements, StripeProvider } from 'react-stripe-elements';

import Layout from 'components/Layout/Layout';
import TrackedPage from 'components/pages/TrackedPage';

import Checkout from 'components/pages/club/Checkout';

type Props = {
    payment: {
        price: number;
        currency: string;
    };
};

type State = {
    stripe?: any;
};

class Club extends React.Component<Props, State> {
    public state: State = {
        stripe: null,
    };

    public componentDidMount() {
        this.setState({
            stripe: (window as any).Stripe(process.env.STRIPE_KEY),
        });
    }

    public render() {
        return (
            <TrackedPage name="Subscribe">
                <Layout>
                    <React.Fragment>
                        <StripeProvider stripe={this.state.stripe}>
                            <div id="checkout" className="container page-padding">
                                <header id="checkout-header">
                                    <h1 id="checkout-header-title">Join the club</h1>
                                    <h2 id="checkout-header-subtitle">
                                        Krak Skateboarding Club - 12 month membership - billed quarterly
                                    </h2>
                                    <div id="checkout-header-price-container">
                                        <p id="checkout-header-price">
                                            {this.props.payment.currency === 'usd' && '$'}
                                            {this.props.payment.currency === 'gbp' && '£'}
                                            {this.props.payment.price / 100}
                                            {this.props.payment.currency === 'eur' && '€'} today
                                        </p>
                                        <p id="checkout-header-price-details">to be covered until April 5th 2019</p>
                                    </div>
                                </header>
                                <Elements>
                                    <Checkout />
                                </Elements>
                            </div>
                        </StripeProvider>
                    </React.Fragment>
                </Layout>
            </TrackedPage>
        );
    }
}

export default connect((state: any) => ({
    payment: state.payment,
}))(Club);
