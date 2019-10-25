import getConfig from 'next/config';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React from 'react';
import { connect } from 'react-redux';

import Types from 'Types';

import Layout from 'components/Layout/Layout';
import Hero from 'components/pages/club/landing/Hero';
import TrackedPage from 'components/pages/TrackedPage';

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
            <script src="https://js.stripe.com/v3" />
        </Head>
    );
};

const SubscribeModal = dynamic(() => import('components/pages/club/subscribe/subscribeModal'), { ssr: false });
const Intro = dynamic(() => import('components/pages/club/landing/Intro'));
const Monthly = dynamic(() => import('components/pages/club/landing/Monthly'));
const Quarterly = dynamic(() => import('components/pages/club/landing/Quarterly'));

interface DynamicMainProps {
    onOpenQuarterModal: () => void;
}
const DynamicMain = (props: DynamicMainProps) => (
    <main id="club-main">
        <Intro />
        <Monthly />
        <div className="club-section-divider" />
        <Quarterly onOpenQuarterModal={props.onOpenQuarterModal} />
    </main>
);

type State = {
    isSubscribeModalOpen: boolean;
    modalStep: string;
};

class Club extends React.Component<{}, State> {
    public state: State = {
        isSubscribeModalOpen: false,
        modalStep: 'summary',
    };

    public componentDidMount() {
        document.getElementById('header-top').classList.add('header-white');
    }

    public componentWillUnmount() {
        document.getElementById('header-top').classList.remove('header-white');
    }

    public render() {
        const { isSubscribeModalOpen, modalStep } = this.state;
        return (
            <TrackedPage name="Club">
                <Layout head={<ClubHead />}>
                    <SubscribeModal
                        open={isSubscribeModalOpen}
                        onClose={this.onCloseSubscribeModal}
                        modalStep={modalStep}
                    />
                    <div id="club" className="inner-page-container container-fluid">
                        <Hero onOpenSummaryModal={this.onOpenSummaryModal} />
                        <DynamicMain onOpenQuarterModal={this.onOpenQuarterModal} />
                    </div>
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

export default Club;
