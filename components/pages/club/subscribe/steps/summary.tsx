import getConfig from 'next/config';
import React from 'react';

import IconSoldOut from 'components/Ui/Icons/SoldOut';

type Props = {
    onNextClick: () => void;
    pricingQuarter: string;
    pricingMonth: string;
};

class Summary extends React.Component<Props, {}> {
    public render() {
        const { onNextClick, pricingQuarter, pricingMonth } = this.props;
        const quarterFull: boolean = getConfig().publicRuntimeConfig.IS_QUARTERFULL;
        return (
            <div className="subscribe modal-two-col-container modal-two-col-form subscribe-summary">
                <div className="modal-two-col-first-container modal-two-col-item-container">
                    <h3 className="subscribe-summary-title">Monthly membership</h3>
                    <p className="subscribe-summary-price">Starts at {pricingMonth} / month</p>
                    <ul className="subscribe-summary-app-container">
                        <li className="subscribe-summary-app">
                            <img src="https://res.skatekrak.com/static/skatekrak.com/Icons/krakito.svg" alt="Krakito" />
                        </li>
                        <li className="subscribe-summary-app">
                            <img
                                src="https://res.skatekrak.com/static/skatekrak.com/Icons/krakapp.svg"
                                alt="Krak app"
                            />
                        </li>
                        <li className="subscribe-summary-app">
                            <img
                                src="https://res.skatekrak.com/static/skatekrak.com/Icons/kraksession.svg"
                                alt="Krak session"
                                id="club-monthly-main-app-kraksession"
                            />
                        </li>
                    </ul>
                    <ul className="subscribe-summary-benefits">
                        <li className="subscribe-summary-benefit">Access to: Krakito</li>
                        <li className="subscribe-summary-benefit">Deals on skate goods</li>
                        <li className="subscribe-summary-benefit">Invites to secret events</li>
                        <li className="subscribe-summary-benefit">Special features on our apps</li>
                    </ul>
                    <a
                        className="button-primary subscribe-summary-cta"
                        href="https://www.krakito.com"
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        Join
                    </a>
                </div>
                <div className="modal-two-col-second-container modal-two-col-item-container">
                    <h3 className="subscribe-summary-title">Quarterly membership</h3>
                    <p className="subscribe-summary-price">{pricingQuarter} / quarterly</p>
                    <div className="subscribe-summary-quarter-status">
                        {!quarterFull ? (
                            'Become a Kraken.'
                        ) : (
                            <div className="subscribe-summary-quarter-full">
                                <span>Next batch</span>
                                <IconSoldOut />
                                <span>{removeYear(getConfig().publicRuntimeConfig.NEXT_QUARTER_START)}</span>
                            </div>
                        )}
                    </div>
                    <ul className="subscribe-summary-benefits">
                        <li className="subscribe-summary-benefit">
                            <span>everything from the monthly plan +</span>
                        </li>
                        <li className="subscribe-summary-benefit">an exclusive deck +</li>
                        <li className="subscribe-summary-benefit">an exclusive T-shirt +</li>
                        <li className="subscribe-summary-benefit">the one & only KrakBox +</li>
                    </ul>
                    <p className="subscribe-summary-cta-text">Limited quantities available</p>
                    <button className="button-primary subscribe-summary-cta" onClick={onNextClick}>
                        Save your spot
                    </button>
                </div>
            </div>
        );
    }
}

/**
 * We assume that the date is like this:
 * October 5th 2019
 */
function removeYear(str: string): string {
    const split = str.split(' ');
    return split[0] + ' ' + split[1];
}

export default Summary;