import * as React from 'react';
import { Elements, StripeProvider } from 'react-stripe-elements';

import Layout from 'components/Layout/Layout';
import 'static/styles/checkout.styl';

import Checkout from 'components/pages/club/Checkout';

type State = {
    stripe?: any;
};

class Club extends React.Component<{}> {
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
            <Layout>
                <React.Fragment>
                    <StripeProvider stripe={this.state.stripe}>
                        <div id="checkout" className="container">
                            <header id="checkout-header">
                                <h1 id="checkout-header-title">Join the club</h1>
                                <h2 id="checkout-header-subtitle">Krak Skateboarding Club - 12 month membership</h2>
                                <div id="checkout-header-price-container">
                                    <p id="checkout-header-price">$348 today</p>
                                    <p id="checkout-header-price-details">to be covered until December 2019</p>
                                </div>
                            </header>
                            <Elements>
                                <Checkout />
                            </Elements>
                        </div>
                    </StripeProvider>
                </React.Fragment>
            </Layout>
        );
    }
}

export default Club;
