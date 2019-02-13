import classNames from 'classnames';
import React from 'react';

import Link from 'components/Link';
import Address from 'components/Ui/Form/Address';
import Field from 'components/Ui/Form/Field';
import Emoji from 'components/Ui/Icons/Emoji';

type Props = {
    quarterFull: boolean;
    onNextClick: () => void;
};

type State = {
    billingAddress: boolean;
    addressView: string;
};

class Subscribe extends React.Component<Props, State> {
    public state: State = {
        billingAddress: false,
        addressView: 'shipping',
    };

    public render() {
        const { quarterFull, onNextClick } = this.props;
        const { addressView, billingAddress } = this.state;
        return (
            <form id="subscribe-container" className="subscribe-form" onSubmit={this.handleSubmit}>
                <div id="subscribe-first-container" className="subscribe-item-container">
                    <h1 className="subscribe-title">{!quarterFull ? 'Become a Kraken' : 'Pre-pay'}</h1>
                    <div className="subscribe-content">
                        <p className="subscribe-content-description">
                            {quarterFull && (
                                <p className="subscribe-content-description-paragraph">
                                    Pre-pay your membership now and be sure to become a Kraken from April 5th to July
                                    4th 2019.
                                </p>
                            )}
                            {!quarterFull ? 'On April 5th 2019' : 'On July 5th 2019'}, your membership will be
                            automatically renewed. Of course, we don’t wanna force anyone so if you’re not happy, you
                            can cancel anytime from your profile.
                        </p>
                        <div className="subscribe-payment-line">
                            <p className="subscribe-payment-line-title">Club membership:</p>
                            <div className="subscribe-payment-line-separator" />
                            <span className="subscribe-payment-line-price">99€</span>
                        </div>
                        <Field name="creditCard" placeholder="Credit card" />
                        <div className="form-element">
                            <label htmlFor="rememberMe" className="checkbox-container">
                                I agree with the terms and conditions
                                <span className="checkmark" />
                            </label>
                        </div>
                        <div className="form-element">
                            <label htmlFor="rememberMe" className="checkbox-container">
                                Use shipping address as billing address
                                <span className="checkmark" />
                            </label>
                        </div>
                    </div>
                    <div className="subscribe-legal">
                        <Link href="/terms-and-conditions">
                            <a className="subscribe-legal-link">Terms and conditions</a>
                        </Link>
                    </div>
                    <div id="subscribe-container-separator" />
                </div>
                <div id="subscribe-second-container" className="subscribe-item-container">
                    <div className="subscribe-subtitles-container">
                        <button
                            onClick={this.toggleAddressView}
                            className={classNames('subscribe-subtitle', {
                                'subscribe-subtitle--alone': !billingAddress,
                                'subscribe-subtitle--inactive': addressView !== 'shipping',
                            })}
                        >
                            <Emoji symbol="📦" label="package" />
                            <span className="subscribe-subtitle-text">Shipping address</span>
                        </button>
                        {billingAddress && (
                            <button
                                onClick={this.toggleAddressView}
                                className={classNames('subscribe-subtitle', {
                                    'subscribe-subtitle--border': billingAddress,
                                    'subscribe-subtitle--inactive': addressView !== 'billing',
                                })}
                            >
                                <Emoji symbol="💳" label="package" />
                                <span className="subscribe-subtitle-text">Billing address</span>
                            </button>
                        )}
                    </div>
                    <div className="subscribe-content">{addressView === 'shipping' ? <Address /> : <Address />}</div>
                    <button onClick={onNextClick} className="button-primary subscribe-form-submit">
                        Pay 99€
                    </button>
                </div>
            </form>
        );
    }

    private handleSubmit = (evt: any) => {
        evt.preventDefault();
    };

    private toggleAddressView = () => {
        if (this.state.billingAddress) {
            if (this.state.addressView === 'billing') {
                this.setState({ addressView: 'shipping' });
            } else {
                this.setState({ addressView: 'billing' });
            }
        }
    };
}

export default Subscribe;
