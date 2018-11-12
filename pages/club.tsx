import * as React from 'react';
import classNames from 'classnames';

import Layout from 'components/Layout/Layout';
import 'static/styles/checkout.styl';

import Address from 'components/Ui/Form/Address';
import FormElement from 'components/Ui/Form/Element';
import Input from 'components/Ui/Form/Input';

type State = {
    valideForm: boolean;
};

export default class Club extends React.Component<{}, State> {
    state = {
        valideForm: false,
    };

    public render() {
        const { valideForm } = this.state;

        return (
            <Layout>
                <div id="checkout" className="container">
                    <header id="checkout-header">
                        <h1 id="checkout-header-title">Join the club</h1>
                        <h2 id="checkout-header-subtitle">Krak Skateboarding Club - 12 month membership</h2>
                        <div id="checkout-header-price-container">
                            <p id="checkout-header-price">$348 today</p>
                            <p id="checkout-header-price-details">to be covered until December 2019</p>
                        </div>
                    </header>
                    <main id="checkout-main">
                        <form id="checkout-form-shipping" className="checkout-form">
                            <div className="row">
                                <div className="form-section col-xs-12 col-md-6">
                                    <p className="form-section-title">Shipping information</p>
                                    <p className="form-section-description">
                                        Give us your shipping information so we can send you the best skateboard right
                                        on your doorstep!
                                    </p>
                                    <div className="checkout-form-fields-container">
                                        <FormElement label="E-mail address *">
                                            <Input type="email" name="user-email" required />
                                        </FormElement>
                                        <Address />
                                    </div>
                                </div>
                                <div className="form-section col-xs-12 col-md-offset-1 col-md-5">
                                    <button
                                        className={classNames('checkout-form-submit-button', {
                                            'checkout-form-submit-button--enable': valideForm,
                                        })}
                                        disabled={!valideForm}
                                    >
                                        Payment
                                    </button>
                                    <div id="checkout-contact">
                                        <h4 id="checkout-contact-title">Questions?</h4>
                                        <p>
                                            Contact our support team at{' '}
                                            <a id="checkout-contact-mail" href="mailto:club@skatekrak.com">
                                                club@skatekrak.com
                                            </a>
                                        </p>
                                    </div>
                                    <img
                                        className="checkout-form-img"
                                        src="../static/images/step_1_2x.png"
                                        alt="Kraken illustration step 1"
                                    />
                                </div>
                            </div>
                        </form>
                    </main>
                </div>
            </Layout>
        );
    }
}
