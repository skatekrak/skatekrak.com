import Analytics, { ABTest, Variation } from '@thepunkclub/analytics';
import Head from 'next/head';
import React from 'react';
import { connect } from 'react-redux';

import Layout from 'components/Layout/Layout';
import Link from 'components/Link';
import TrackedPage from 'components/pages/TrackedPage';
import SkateistanLogo from 'components/Ui/Icons/Logos/Skateistan';

type Props = {
    payment: {
        price: number;
        currency: string;
    };
};

type State = {
    pricing: string;
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
        pricing: this.getPricingText('29', '/month'),
    };

    public componentDidMount() {
        const original = new Variation('original');
        const quarterly = new Variation('quarterly');
        quarterly.setActivate(() => this.setState({ pricing: this.getPricingText('87', '/quarter') }));
        const abTest = new ABTest('ctakscjoin');
        abTest.setPercentage(100);
        abTest.addIncludedTarget({
            attribute: 'url',
            inverted: '0',
            type: 'equals_simple',
            value: 'https://skatekrak.com/club',
        });
        abTest.addVariation(original);
        abTest.addVariation(quarterly);
        Analytics.default().trackABTest(abTest);
    }

    public render() {
        const { pricing } = this.state;
        return (
            <TrackedPage name="Club">
                <Layout head={<ClubHead />}>
                    <div id="club" className="inner-page-container container-fluid">
                        <div id="club-header">
                            <h1 id="club-header-title">Krak Skateboarding Club.</h1>
                            <h2 id="club-header-subtitle">12 month membership</h2>
                            <span id="club-header-bg-circle" />
                        </div>
                        <div id="club-cta-container">
                            <Link href="/club/subscribe" prefetch>
                                <a id="club-cta">Join the club - {pricing}</a>
                            </Link>
                        </div>
                        <div id="club-benefits">
                            <div id="club-bg-image-container">
                                <span
                                    id="club-bg-image"
                                    role="img"
                                    aria-label="[Sebo Walker, nollie inward heel. Photo: Amrit Jain]"
                                />
                                <span id="club-bg-image-credits">
                                    Sebo Walker, nollie inward heel. Photo: Amrit Jain
                                </span>
                            </div>
                            <div id="club-benefits-container">
                                <h3 id="club-benefits-title">Including</h3>
                                <div className="row">
                                    <ul className="col-xs-12 col-md-4">
                                        <li className="club-benefit">4 decks (one every quarter)</li>
                                        <li className="club-benefit">One pair of shoes</li>
                                        <li className="club-benefit">The 2019 welcome package</li>
                                        <li className="club-benefit">8 KrakBox</li>
                                        <li className="club-benefit">One watch</li>
                                    </ul>
                                    <ul className="col-xs-12 col-md-4">
                                        <li className="club-benefit">The 2019 calendar</li>
                                        <li className="club-benefit">The bi-annual magazine</li>
                                        <li className="club-benefit">Access to exclusive content online</li>
                                        <li className="club-benefit">Private chat room</li>
                                        <li className="club-benefit">Invites to members only workshops & events</li>
                                    </ul>
                                    <ul className="col-xs-12 col-md-4">
                                        <li className="club-benefit">Special treat in skateparks</li>
                                        <li className="club-benefit">
                                            Discounts in shops & special partners (like skatecamps & trips)
                                        </li>
                                        <li className="club-benefit">Curated deals & few surprises all year long</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div id="club-skateistan">
                            <SkateistanLogo />
                            <p id="club-skateistan-text">
                                We wanna do good - that’s why 10% of your membership goes to{' '}
                                <a
                                    href="https://www.skateistan.org/"
                                    id="club-skateistan-link"
                                    target="_blank"
                                    rel="noreferrer noopener"
                                >
                                    Skateistan
                                </a>
                                .<span id="club-skateistan-citizens">Become a citizen too.</span>
                            </p>
                        </div>
                    </div>
                </Layout>
            </TrackedPage>
        );
    }

    private getPricingText(price: string, frequency: string): string {
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
        res += frequency;
        return res;
    }
}

export default connect((state: any) => ({ payment: state.payment }))(Club);
