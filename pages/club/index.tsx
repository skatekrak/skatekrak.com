import * as React from 'react';
import { connect } from 'react-redux';

import Layout from 'components/Layout/Layout';
import Link from 'components/Link';
import TrackedPage from 'components/pages/TrackedPage';
import SkateistanLogo from 'components/Ui/Icons/Logos/Skateistan';

interface IClubProps {
    payment: {
        price: number;
        currency: string;
    };
}

const Club: React.SFC<IClubProps> = ({ payment }) => (
    <TrackedPage name="Club">
        <Layout>
            <div id="club" className="container-fluid page-padding">
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
                                <li className="club-benefit">9 KrakBox</li>
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
                        We wanna do good - that’s why 10% of your annual membership goes to{' '}
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

export default connect((state: any) => ({
    payment: state.payment,
}))(Club);
