import Link from 'next/link';
import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';

import 'static/styles/checkout.styl';
import 'static/styles/club.styl';
import 'static/styles/checkbox.styl';

import Layout from 'components/Layout/Layout';
import SkateistanLogo from 'components/Ui/Icons/Logos/Skateistan';
import { savePricingCurrency } from 'store/reducers/payment';

interface IClubProps {
    payment: {
        price: number;
        currency: string;
    };
    query: Record<string, string | string[]>;
}

class Club extends React.Component<IClubProps & DispatchProp> {
    public static async getInitialProps({ query }) {
        return { query };
    }

    public componentDidMount() {
        const { query, dispatch } = this.props;
        if (query.cc && query.cc === 'us') {
            dispatch(savePricingCurrency(34800, 'usd'));
        } else {
            dispatch(savePricingCurrency(34800, 'eur'));
        }
    }

    public render() {
        const { payment } = this.props;
        return (
            <Layout>
                <div id="club">
                    <div id="club-header">
                        <h1 id="club-header-title">Krak Skateboarding Club.</h1>
                        <h2 id="club-header-subtitle">12 month membership</h2>
                        <span id="club-header-bg-circle" />
                    </div>
                    <div id="club-cta-container">
                        <Link href="/club/subscribe" prefetch>
                            <a id="club-cta">
                                Join the club - {payment.currency === 'usd' && '$'}29
                                {payment.currency === 'eur' && '€'}/month
                            </a>
                        </Link>
                    </div>
                    <div id="club-benefits">
                        <div id="club-bg-image-container">
                            <span
                                id="club-bg-image"
                                role="img"
                                aria-label="[Sebo Walker, nollie inward heel. Photo: Amrit Jain]"
                            />
                            <span id="club-bg-image-credits">Sebo Walker, nollie inward heel. Photo: Amrit Jain</span>
                        </div>
                        <div id="club-benefits-container">
                            <h3 id="club-benefits-title">Including</h3>
                            <div className="row">
                                <ul className="col-xs-12 col-md-4">
                                    <li className="club-benefit">4 decks (one every quarter)</li>
                                    <li className="club-benefit">One pair of shoes</li>
                                    <li className="club-benefit">The 2019 welcome package</li>
                                    <li className="club-benefit">9 Krakbox</li>
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
                            We wanna do good - that’s why 10% of your subscription goes directly to{' '}
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
        );
    }
}

export default connect((state: any) => ({
    payment: state.payment,
}))(Club);
