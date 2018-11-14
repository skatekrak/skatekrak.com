import classNames from 'classnames';
import React from 'react';
import { connect } from 'react-redux';
import { CardElement } from 'react-stripe-elements';
import { InjectedFormProps, reduxForm } from 'redux-form';

import Address from 'components/Ui/Form/Address';
import FormElement from 'components/Ui/Form/Element';
import ErrorMessage from 'components/Ui/Form/ErrorMessage';

type Props = {
    onSubmit: () => void;
    payment: {
        price: number;
        currency: string;
    };
    stripeError?: string;
};

type State = {
    showBilling: boolean;
};

class PaymentForm extends React.Component<Props & InjectedFormProps, State> {
    public state: State = {
        showBilling: false,
    };

    public render() {
        const { handleSubmit, submitting, valid, stripeError } = this.props;
        return (
            <>
                <form id="checkout-form-payment" className="checkout-form" onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="form-section col-xs-12 col-md-6">
                            <p className="form-section-title">Payment information</p>
                            <div className="checkout-form-fields-container">
                                <FormElement label="Card details" invalid={stripeError === undefined}>
                                    <>
                                        <CardElement />
                                        {stripeError && <ErrorMessage message={stripeError} />}
                                    </>
                                </FormElement>
                                <input
                                    type="checkbox"
                                    id="show-billing"
                                    name="show-billing"
                                    checked={!this.state.showBilling}
                                    onChange={this.toggleBillingInfo}
                                />
                                <label htmlFor="show-billing">Use shipping address as billing address</label>
                            </div>
                            {this.state.showBilling && (
                                <>
                                    <p className="form-section-title">Billings infos</p>
                                    <div className="checkout-form-fields-container">
                                        <Address />
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="form-section col-xs-12 col-md-offset-1 col-md-5">
                            <button
                                className={classNames('checkout-form-submit-button', {
                                    'checkout-form-submit-button--enable': !(!valid || submitting),
                                })}
                                disabled={!valid || submitting}
                            >
                                Pay {this.props.payment.currency === 'usd' && '$'}
                                {this.props.payment.price / 100}
                                {this.props.payment.currency === 'eur' && '€'}
                            </button>
                            <img
                                className="checkout-form-img"
                                src="/static/images/step_1_2x.png"
                                alt="Kraken illustration step 1"
                            />
                        </div>
                    </div>
                </form>
            </>
        );
    }

    private toggleBillingInfo = (event) => {
        this.setState({ showBilling: !event.target.checked });
    };
}

const validate = (values) => {
    const errors: any = {};

    if (!values.firstName) {
        errors.firstName = 'Required';
    }

    if (!values.lastName) {
        errors.lastName = 'Required';
    }

    if (!values.line1) {
        errors.line1 = 'Required';
    }

    if (!values.city) {
        errors.city = 'Required';
    }

    if (!values.postalcode) {
        errors.postalcode = 'Required';
    }

    if (!values.country) {
        errors.country = 'Required';
    }

    return errors;
};

export default connect((state: any) => ({
    payment: state.payment,
}))(
    reduxForm({
        form: 'payment',
        destroyOnUnmount: false,
        forceUnregisterOnUnmount: true,
        validate,
    })(PaymentForm),
);
