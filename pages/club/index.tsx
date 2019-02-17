import Head from 'next/head';
import React from 'react';
import ReactPlayer from 'react-player';
import { connect } from 'react-redux';
import { Elements, StripeProvider } from 'react-stripe-elements';

import Layout from 'components/Layout/Layout';
import SubscribeModal from 'components/pages/club/subscribe/subscribeModal';
import TrackedPage from 'components/pages/TrackedPage';
import Emoji from 'components/Ui/Icons/Emoji';
import SkateistanLogo from 'components/Ui/Icons/Logos/Skateistan';

type Props = {
    payment: {
        price: number;
        currency: string;
    };
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
            stripe: (window as any).Stripe(process.env.STRIPE_KEY),
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
                                <header id="club-header">
                                    <div id="club-header-headline">
                                        <h1 id="club-header-title">Krak Skate Club</h1>
                                        <h2 id="club-header-subtitle">Dig deeper into skateboarding</h2>
                                    </div>
                                    <p id="club-header-obsessed">Obsessed to ride</p>
                                    <div className="club-cta-container">
                                        <p className="club-cta-limited">- Limited quantities available -</p>
                                        <button className="club-cta button-primary" onClick={this.onOpenSubscribeModal}>
                                            Become a Kraken for{' '}
                                            {this.getPricingText(String(this.props.payment.price / 100))} a quarter
                                        </button>
                                        <p className="club-cta-shipping">
                                            <Emoji symbol="🚚" label="I dont know" />
                                            Free shipping
                                        </p>
                                    </div>
                                    <div id="club-header-bg-image-container">
                                        <span
                                            id="club-header-bg-image"
                                            role="img"
                                            aria-label="[Sebo Walker, nollie inward heel. Photo: Amrit Jain]"
                                        />
                                        <span id="club-header-bg-image-credits">
                                            Sebo Walker, nollie inward heel. Photo: Amrit Jain
                                        </span>
                                    </div>
                                </header>
                                <main id="club-main">
                                    <h2 id="club-main-title">Every quarter you get something to:</h2>
                                    <div id="club-main-benefits">
                                        <div className="row">
                                            <div className="club-main-benefit col-xs-12 col-sm-6 col-md-4">
                                                <span className="club-main-benefit-icon">
                                                    <img
                                                        src="/static/images/club/club-ride.svg"
                                                        alt=""
                                                        className="club-benefit-icon"
                                                    />
                                                </span>
                                                <h3 className="club-main-benefit-title">Ride</h3>
                                                <p className="club-main-benefit-text">
                                                    <span className="club-main-benefit-text-item">
                                                        - an exclusive deck
                                                    </span>
                                                    <span className="club-main-benefit-text-item">
                                                        - the one & only classic KrakBox
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="club-main-benefit col-xs-12 col-sm-6 col-md-4">
                                                <span className="club-main-benefit-icon">
                                                    <img
                                                        src="/static/images/club/club-wear.svg"
                                                        alt=""
                                                        className="club-benefit-icon"
                                                    />
                                                </span>
                                                <h3 className="club-main-benefit-title">Wear</h3>
                                                <p className="club-main-benefit-text">
                                                    <span className="club-main-benefit-text-item">
                                                        - an exclusive t-shirt
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="club-main-benefit col-xs-12 col-sm-6 col-md-4">
                                                <span className="club-main-benefit-icon">
                                                    <img
                                                        src="/static/images/club/club-connect.svg"
                                                        alt=""
                                                        className="club-benefit-icon"
                                                    />
                                                </span>
                                                <h3 className="club-main-benefit-title">Connect</h3>
                                                <p className="club-main-benefit-text">
                                                    <span className="club-main-benefit-text-item">
                                                        - access to a ‘krakens only’
                                                        <br />
                                                        social network
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="club-main-benefit col-xs-12 col-sm-6 col-md-4 col-md-offset-2">
                                                <span className="club-main-benefit-icon">
                                                    <img
                                                        src="/static/images/club/club-digest.svg"
                                                        alt=""
                                                        className="club-benefit-icon"
                                                    />
                                                </span>
                                                <h3 className="club-main-benefit-title">Digest</h3>
                                                <p className="club-main-benefit-text">
                                                    <span className="club-main-benefit-text-item">
                                                        - special interviews & workshops
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="club-main-benefit col-xs-12 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-0">
                                                <span className="club-main-benefit-icon">
                                                    <img
                                                        src="/static/images/club/club-wow.svg"
                                                        alt=""
                                                        className="club-benefit-icon"
                                                    />
                                                </span>
                                                <h3 className="club-main-benefit-title">Wow</h3>
                                                <p className="club-main-benefit-text">
                                                    <span className="club-main-benefit-text-item">
                                                        - few surprises up our sleeves
                                                        <br />
                                                        [& some are BIG - size matters]
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <p id="club-main-santa">
                                        It’s damn simple.
                                        <br />
                                        We put Santa Claus on a board all year long.
                                    </p>
                                    <div id="club-main-youtube">
                                        <h2 id="club-main-youtube-title">Best Of KrakBox unboxing</h2>
                                        <ul id="club-main-youtube-videos" className="row">
                                            <li className="club-main-youtube-item col-xs-12 col-sm-6 col-md-4">
                                                <div className="club-main-youtube-item-player-container">
                                                    <div className="club-main-youtube-item-player">
                                                        <ReactPlayer
                                                            url="https://www.youtube.com/watch?v=cdghhu3Yj8A"
                                                            controls
                                                            height="100%"
                                                            width="100%"
                                                            light
                                                        />
                                                    </div>
                                                </div>
                                                <h3 className="club-main-youtube-item-title">Best of #4</h3>
                                            </li>
                                            <li className="club-main-youtube-item col-xs-12 col-sm-6 col-md-4">
                                                <div className="club-main-youtube-item-player-container">
                                                    <div className="club-main-youtube-item-player">
                                                        <ReactPlayer
                                                            url="https://www.youtube.com/watch?v=BvdDTThUzME"
                                                            controls
                                                            height="100%"
                                                            width="100%"
                                                            light
                                                        />
                                                    </div>
                                                </div>
                                                <h3 className="club-main-youtube-item-title">Best of #3</h3>
                                            </li>
                                            <li className="club-main-youtube-item col-xs-12 col-sm-6 col-md-4">
                                                <div className="club-main-youtube-item-player-container">
                                                    <div className="club-main-youtube-item-player">
                                                        <ReactPlayer
                                                            url="https://www.youtube.com/watch?v=D2yrZ-i-4WU"
                                                            controls
                                                            height="100%"
                                                            width="100%"
                                                            light
                                                        />
                                                    </div>
                                                </div>
                                                <h3 className="club-main-youtube-item-title">Best of #2</h3>
                                            </li>
                                        </ul>
                                    </div>
                                </main>
                                <footer id="club-footer">
                                    <div className="club-cta-container">
                                        <p className="club-cta-limited">- Limited quantities available -</p>
                                        <button className="club-cta button-primary" onClick={this.onOpenSubscribeModal}>
                                            Become a Kraken for 99€ a quarter
                                        </button>
                                        <p className="club-cta-shipping">
                                            <Emoji symbol="🚚" label="I dont know" />
                                            Free shipping
                                        </p>
                                    </div>
                                    <div id="club-footer-skateistan">
                                        <SkateistanLogo />
                                        <p id="club-footer-skateistan-text">
                                            We wanna do good - that’s why 10% of your membership goes to{' '}
                                            <a
                                                href="https://www.skateistan.org/"
                                                id="club-footer-skateistan-link"
                                                target="_blank"
                                                rel="noreferrer noopener"
                                            >
                                                Skateistan
                                            </a>
                                            .<span id="club-footer-skateistan-citizens">Become a citizen too.</span>
                                        </p>
                                    </div>
                                </footer>
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

export default connect((state: any) => ({ payment: state.payment }))(Club);
