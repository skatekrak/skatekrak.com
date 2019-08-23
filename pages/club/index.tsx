import getConfig from 'next/config';
import Head from 'next/head';
import React from 'react';
import { connect } from 'react-redux';
import { Elements, StripeProvider } from 'react-stripe-elements';

import Types from 'Types';

import { User } from 'store/auth/reducers';

import Layout from 'components/Layout/Layout';
import Hero from 'components/pages/club/landing/Hero';
import Intro from 'components/pages/club/landing/Intro';
import Monthly from 'components/pages/club/landing/Monthly';
import Quarterly from 'components/pages/club/landing/Quarterly';
import SubscribeModal from 'components/pages/club/subscribe/subscribeModal';
import TrackedPage from 'components/pages/TrackedPage';

type Props = {
    payment: {
        price: number;
        currency: string;
    };
    authUser?: User;
};

type State = {
    stripe?: any;
    isSubscribeModalOpen: boolean;
};

const ClubHead = () => (
    <Head>
        <title>Krak | Club</title>
        <meta
            name="description"
            content="Krak Skateboarding Club. You're not alone. Let's enjoy skateboarding even more."
        />
        <meta property="og:title" content="Krak Skateboarding Club" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://skatekrak.com/club" />
        <meta property="og:image" content="https://skatekrak.com/static/images/og-club.jpg" />
        <meta
            property="og:description"
            content="Krak Skateboarding Club. You're not alone. Let's enjoy skateboarding even more"
        />
    </Head>
);

class Club extends React.Component<Props, State> {
    public state: State = {
        stripe: null,
        isSubscribeModalOpen: false,
    };

    public componentDidMount() {
        document.getElementById('header-top').classList.add('header-white');
        this.setState({
            stripe: (window as any).Stripe(getConfig().publicRuntimeConfig.STRIPE_KEY),
        });
    }

    public componentWillUnmount() {
        document.getElementById('header-top').classList.remove('header-white');
    }

    public render() {
        const { isSubscribeModalOpen } = this.state;
        return (
            <TrackedPage name="Club">
                <Layout head={<ClubHead />}>
                    <StripeProvider stripe={this.state.stripe}>
                        <>
                            <Elements>
                                <SubscribeModal open={isSubscribeModalOpen} onClose={this.onCloseSubscribeModal} />
                            </Elements>
                            <div id="club" className="inner-page-container container-fluid">
                                <Hero authUser={this.props.authUser} onOpenSubscribeModal={this.onOpenSubscribeModal} />
                                <main id="club-main">
                                    <Intro
                                        currency={this.getPricingText(String())}
                                        pricing={this.getPricingText(String(this.props.payment.price / 100))}
                                    />
                                    <Monthly />
                                    <div className="club-section-divider" />
                                    <Quarterly onOpenSubscribeModal={this.onOpenSubscribeModal} />
                                </main>
                            </div>
                        </>
                    </StripeProvider>
                </Layout>
            </TrackedPage>
        );
    }

    private onOpenSubscribeModal = () => {
        this.setState({
            isSubscribeModalOpen: true,
        });
    };

    private onCloseSubscribeModal = () => {
        this.setState({ isSubscribeModalOpen: false });
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
}

const mapStateToProps = ({ payment, auth }: Types.RootState) => {
    return { payment, authUser: auth.authUser };
};

export default connect(mapStateToProps)(Club);
