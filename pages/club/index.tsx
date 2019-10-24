import getConfig from 'next/config';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React from 'react';
import { connect } from 'react-redux';

import Types from 'Types';

import { User } from 'store/auth/reducers';

import Layout from 'components/Layout/Layout';
import Hero from 'components/pages/club/landing/Hero';
import TrackedPage from 'components/pages/TrackedPage';

import { withApollo } from 'hocs/withApollo';

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

const DynamicSubscribeModal = dynamic(() => import('components/pages/club/subscribe/subscribeModal'), { ssr: false });

interface DynamicMainProps {
    onOpenQuarterModal: () => void;
}
const DynamicMain = dynamic<DynamicMainProps>({
    modules: () => {
        const components: any = {
            Intro: import('components/pages/club/landing/Intro'),
            Monthly: import('components/pages/club/landing/Monthly'),
            Quarterly: import('components/pages/club/landing/Quarterly'),
        };
        return components;
    },
    render: (props, { Intro, Monthly, Quarterly }) => (
        <main id="club-main">
            <Intro />
            <Monthly />
            <div className="club-section-divider" />
            <Quarterly onOpenQuarterModal={props.onOpenQuarterModal} />
        </main>
    ),
});

type Props = {
    authUser?: User;
};

type State = {
    isSubscribeModalOpen: boolean;
    modalStep: string;
};

class Club extends React.Component<Props, State> {
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
                    <DynamicSubscribeModal
                        open={isSubscribeModalOpen}
                        onClose={this.onCloseSubscribeModal}
                        modalStep={modalStep}
                    />
                    <div id="club" className="inner-page-container container-fluid">
                        <Hero authUser={this.props.authUser} onOpenSummaryModal={this.onOpenSummaryModal} />
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

const mapStateToProps = ({ auth }: Types.RootState) => {
    return { authUser: auth.authUser };
};

export default connect(mapStateToProps)(withApollo(Club));
