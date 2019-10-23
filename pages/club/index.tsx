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

import { getPricingText } from 'lib/moneyHelper';

import { withApollo } from 'hocs/withApollo';

type Props = {
    authUser?: User;
};

type State = {
    stripe?: any;
    isSubscribeModalOpen: boolean;
    modalStep: string;
};

const ClubHead = () => {
    const baseURL = getConfig().publicRuntimeConfig.WEBSITE_URL;
    return (
        <Head>
            <title>Krak | Club</title>
            <meta
                name="description"
                content="Krak Skateboarding Club. You're not alone. Let's enjoy skateboarding even more."
            />
            <meta property="og:title" content="Krak Skateboarding Club" />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={`${baseURL}/club`} />
            <meta property="og:image" content={`${baseURL}/images/og-club.jpg`} />
            <meta
                property="og:description"
                content="Krak Skateboarding Club. You're not alone. Let's enjoy skateboarding even more"
            />
        </Head>
    );
};

class Club extends React.Component<Props, State> {
    public state: State = {
        stripe: null,
        isSubscribeModalOpen: false,
        modalStep: 'summary',
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
        const { isSubscribeModalOpen, modalStep } = this.state;
        return (
            <TrackedPage name="Club">
                <Layout head={<ClubHead />}>
                    <StripeProvider stripe={this.state.stripe}>
                        <>
                            <Elements>
                                <SubscribeModal
                                    open={isSubscribeModalOpen}
                                    onClose={this.onCloseSubscribeModal}
                                    modalStep={modalStep}
                                />
                            </Elements>
                            <div id="club" className="inner-page-container container-fluid">
                                <Hero authUser={this.props.authUser} onOpenSummaryModal={this.onOpenSummaryModal} />
                                <main id="club-main">
                                    <Intro />
                                    <Monthly />
                                    <div className="club-section-divider" />
                                    <Quarterly onOpenQuarterModal={this.onOpenQuarterModal} />
                                </main>
                            </div>
                        </>
                    </StripeProvider>
                </Layout>
            </TrackedPage>
        );
    }

    private onOpenSummaryModal = () => {
        this.setState({
            isSubscribeModalOpen: true,
            modalStep: 'summary',
        });
    };

    private onOpenQuarterModal = () => {
        this.setState({
            isSubscribeModalOpen: true,
            modalStep: 'account',
        });
    };

    private onCloseSubscribeModal = () => {
        this.setState({ isSubscribeModalOpen: false, modalStep: 'summary' });
    };
}

const mapStateToProps = ({ auth }: Types.RootState) => {
    return { authUser: auth.authUser };
};

export default connect(mapStateToProps)(withApollo(Club));
