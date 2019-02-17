import classNames from 'classnames';
import gql from 'graphql-tag';
import React from 'react';
import { Field as ReactField, Form, FormSpy } from 'react-final-form';
import { connect } from 'react-redux';

import Types from 'Types';

import withApollo, { WithApolloProps } from 'hocs/withApollo';

import { checkPath } from 'lib/checkPath';
import { updateFormState } from 'store/form/actions';
import { savePricingCurrency } from 'store/payment/actions';

import Link from 'components/Link';
import Address from 'components/Ui/Form/Address';
import ErrorMessage from 'components/Ui/Form/ErrorMessage';
import Field from 'components/Ui/Form/Field';
import Emoji from 'components/Ui/Icons/Emoji';
import IconValid from 'components/Ui/Icons/Valid';
import { FORM_ERROR } from 'final-form';

type Props = {
    quarterFull: boolean;
    onNextClick: () => void;
    updateFormState: (form, state) => void;
    subscribeForm?: { [key: string]: any };
    accountForm?: { [key: string]: any };
    savePricingCurrency: (price: number, currency: string) => void;
    payment: {
        price: number;
        currency: string;
    };
};

type State = {
    addressView: string;
    isSpecialCodeValid: boolean;
};

class Subscribe extends React.Component<Props & WithApolloProps, State> {
    public state: State = {
        addressView: 'shipping',
        isSpecialCodeValid: false,
    };

    public render() {
        const { quarterFull, subscribeForm } = this.props;
        const { addressView, isSpecialCodeValid } = this.state;
        return (
            <Form
                onSubmit={this.handleSubmit}
                initialValues={subscribeForm || { shipping: {}, billing: {}, shippingAsBilling: true }}
            >
                {({ handleSubmit, submitting, valid, values, submitError }) => (
                    <form className="modal-two-col-container subscribe" onSubmit={handleSubmit}>
                        <FormSpy onChange={this.onFormChange} />
                        <div className="modal-two-col-first-container modal-two-col-item-container">
                            <h1 className="modal-two-col-title">{!quarterFull ? 'Become a Kraken' : 'Pre-pay'}</h1>
                            <div className="modal-two-col-content">
                                <p className="modal-two-col-content-description" data-size="fs-regular">
                                    {quarterFull && (
                                        <p className="modal-two-col-content-description-paragraph">
                                            Pre-pay your membership now and be sure to become a Kraken from April 5th to
                                            July 4th 2019.
                                        </p>
                                    )}
                                    {!quarterFull ? 'On April 5th 2019' : 'On July 5th 2019'}, your membership will be
                                    automatically renewed. Of course, you can cancel anytime.
                                </p>
                                <div className="subscribe-payment-line">
                                    <p className="subscribe-payment-line-title">Club membership:</p>
                                    <div className="subscribe-payment-line-separator" />
                                    <span className="subscribe-payment-line-price">
                                        {this.getPricingText(String(this.props.payment.price / 100))}
                                    </span>
                                </div>
                                <Field name="creditCard" placeholder="Credit card" />
                                <div id="subscribe-special-code">
                                    <Field
                                        name="specialCode"
                                        placeholder="Special code - optional"
                                        validate={this.checkSpecial}
                                    />
                                    {isSpecialCodeValid && <IconValid />}
                                </div>
                                <div className="form-element">
                                    <label htmlFor="agreeTC" className="checkbox-container">
                                        I agree with the terms and conditions
                                        <ReactField id="agreeTC" name="agreeTC" type="checkbox" component="input" />
                                        <span className="checkmark" />
                                    </label>
                                </div>
                                <div className="form-element">
                                    <label htmlFor="shippingAsBilling" className="checkbox-container">
                                        Use shipping address as billing address
                                        <ReactField
                                            id="shippingAsBilling"
                                            name="shippingAsBilling"
                                            type="checkbox"
                                            component="input"
                                        />
                                        <span className="checkmark" />
                                    </label>
                                </div>
                            </div>
                            <div className="subscribe-legal">
                                <Link href="/terms-and-conditions">
                                    <a className="subscribe-legal-link">Terms and conditions</a>
                                </Link>
                            </div>
                            <div className="modal-two-col-container-separator" />
                        </div>
                        <div className="modal-two-col-second-container modal-two-col-item-container">
                            <div className="modal-two-col-subtitles-container">
                                <button
                                    onClick={values.shippingAsBilling ? null : this.toggleAddressView}
                                    className={classNames('modal-two-col-subtitle', {
                                        'subscribe-subtitle--alone': values.shippingAsBilling,
                                        'subscribe-subtitle--inactive': addressView !== 'shipping',
                                    })}
                                >
                                    <Emoji symbol="📦" label="package" />{' '}
                                    <span className="modal-two-col-subtitle-text">Shipping address</span>
                                </button>
                                {!values.shippingAsBilling && (
                                    <button
                                        onClick={this.toggleAddressView}
                                        className={classNames('modal-two-col-subtitle', {
                                            'subscribe-subtitle--border': !values.shippingAsBilling,
                                            'subscribe-subtitle--inactive': addressView !== 'billing',
                                        })}
                                    >
                                        <Emoji symbol="💳" label="package" />{' '}
                                        <span className="modal-two-col-subtitle-text">Billing address</span>
                                    </button>
                                )}
                            </div>
                            <div className="modal-two-col-content">
                                {addressView === 'shipping' ? (
                                    <Address namePrefix="shipping" allCountries={false} />
                                ) : (
                                    <Address namePrefix="billing" />
                                )}
                            </div>
                            <ErrorMessage message={submitError} />
                            <button
                                type="submit"
                                className="button-primary modal-two-col-form-submit"
                                disabled={submitting}
                            >
                                Pay 99€
                            </button>
                        </div>
                    </form>
                )}
            </Form>
        );
    }

    private handleSubmit = (values: any) => {
        if (!values.shipping) {
            values.shipping = {};
        }

        if (!values.shippingAsBilling && !values.billing) {
            values.billing = {};
        }

        const errors = validateForm(values);
        if (!values.shippingAsBilling && Object.keys(values.billing).length <= 0) {
            errors[FORM_ERROR] =
                'Hey 👋 - one quick thing - give us your billing address or use your shipping address as billing address';
        }

        if (Object.keys(errors).length > 0) {
            return errors;
        }

        const { apolloClient, accountForm } = this.props;

        const variable = {
            email: accountForm.email,
            firstName: accountForm.firstName,
            lastName: accountForm.lastName,
            password: accountForm.password,
        };
    };

    private onFormChange = (state) => {
        if (checkPath(state, 'values.shipping.country.value')) {
            const countryCode = state.values.shipping.country.value;
            let currency = 'eur';
            switch (countryCode) {
                case 'us':
                    currency = 'usd';
                    break;
                case 'gb':
                    currency = 'gbp';
                    break;
                default:
                    break;
            }
            this.props.savePricingCurrency(9900, currency);
        }

        this.props.updateFormState('subscribe', state.values);
    };

    private toggleAddressView = () => {
        if (this.state.addressView === 'billing') {
            this.setState({ addressView: 'shipping' });
        } else {
            this.setState({ addressView: 'billing' });
        }
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

    private checkSpecial = async (value) => {
        if (value) {
            try {
                const response = await this.props.apolloClient.query({
                    query: CHECK_SPECIAL,
                    variables: {
                        code: value,
                    },
                });
                const { checkSpecial } = response.data as any;
                this.setState({ isSpecialCodeValid: checkSpecial });
            } catch (error) {
                console.log(error);
            }
        } else {
            this.setState({ isSpecialCodeValid: false });
        }
    };
}

const validateForm = (values: any) => {
    const errors: { [key: string]: any } = {};
    const shippingErrors: { [key: string]: string } = {};

    if (values.shipping) {
        if (!values.shipping.firstName) {
            shippingErrors.firstName = 'Required';
        }

        if (!values.shipping.lastName) {
            shippingErrors.lastName = 'Required';
        }

        if (!values.shipping.line1) {
            shippingErrors.line1 = 'Required';
        }

        if (!values.shipping.postalCode) {
            shippingErrors.postalCode = 'Required';
        }

        if (!values.shipping.city) {
            shippingErrors.city = 'Required';
        }

        if (!values.shipping.country) {
            shippingErrors.country = 'Required';
        } else if (values.shipping.country.value === 'us' && !values.shipping.state) {
            shippingErrors.state = 'Required';
        }

        if (Object.keys(shippingErrors).length > 0) {
            errors.shipping = shippingErrors;
        }
    }

    if (!values.shippingAsBilling && values.billing) {
        const billingErrors: { [key: string]: string } = {};

        if (!values.billing.firstName) {
            billingErrors.firstName = 'Required';
        }

        if (!values.billing.lastName) {
            billingErrors.lastName = 'Required';
        }

        if (!values.billing.line1) {
            billingErrors.line1 = 'Required';
        }

        if (!values.billing.postalCode) {
            billingErrors.postalCode = 'Required';
        }

        if (!values.billing.city) {
            billingErrors.city = 'Required';
        }

        if (!values.billing.country) {
            billingErrors.country = 'Required';
        } else if (['us', 'ca'].includes(values.billing.country.value) && !values.billing.state) {
            billingErrors.state = 'Required';
        }

        if (Object.keys(billingErrors).length > 0) {
            errors.billing = billingErrors;
        }
    }

    return errors;
};

const CHECK_SPECIAL = gql`
    query checkSpecial($code: String!) {
        checkSpecial(code: $code)
    }
`;

const JOIN_CLUB = gql`
    mutation joinClub($data: JoinClubInput) {
        joinClub(data: $data) {
            id
        }
    }
`;

const mapStateToProps = ({ form, payment }: Types.RootState) => {
    const { subscribe, account } = form;
    return { subscribeForm: subscribe, accountForm: account, payment };
};

export default connect(
    mapStateToProps,
    {
        updateFormState,
        savePricingCurrency,
    },
)(withApollo(Subscribe));
