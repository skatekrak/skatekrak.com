import * as React from 'react';

import Layout from 'components/Layout/Layout';
import 'static/styles/checkout.styl';

import PaymentForm from 'components/pages/club/PaymentForm';
import ShippingForm from 'components/pages/club/ShippingForm';

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
    step: 'shipping' | 'payment' | 'done';
};

class Club extends React.Component<{}, State> {
    public state: State = {
        step: 'payment',
    };

    public render() {
        const { step } = this.state;
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
                        {step === 'shipping' && <ShippingForm onSubmit={this.nextPage} countries={countriesOptions} />}
                        {step === 'payment' && <PaymentForm onSubmit={this.nextPage} />}
                    </main>
                </div>
            </Layout>
        );
    }

    private nextPage = () => {
        this.setState({ step: 'payment' });
    };
}

export default Club;
