import { withApollo, WithApolloClient } from '@apollo/react-hoc';
import Analytics from '@thepunkclub/analytics';
import classNames from 'classnames';
import { FORM_ERROR } from 'final-form';
import gql from 'graphql-tag';
import getConfig from 'next/config';
import Link from 'next/link';
import React from 'react';
import { Field as ReactField, Form, FormSpy, FormSpyRenderProps } from 'react-final-form';
import { connect } from 'react-redux';
import { CardElement, injectStripe, ReactStripeElements } from 'react-stripe-elements';

import Types from 'Types';

import { checkPath } from 'lib/checkPath';
import { getPricingText } from 'lib/moneyHelper';
import { userSignin } from 'store/auth/actions';
import { updateFormState } from 'store/form/actions';
import { savePricingCurrency } from 'store/payment/actions';

import ButtonPrimary from 'components/Ui/Button/ButtonPrimary';
import Address from 'components/Ui/Form/Address';
import ErrorMessage from 'components/Ui/Form/ErrorMessage';
import Field from 'components/Ui/Form/Field';
import Emoji from 'components/Ui/Icons/Emoji';
import IconValid from 'components/Ui/Icons/Valid';

type Props = {
    onNextClick: () => void;
    updateFormState: (form, state) => void;
    subscribeForm?: { [key: string]: any };
    accountForm?: { [key: string]: any };
    savePricingCurrency: (price: number, currency: string) => void;
    payment: {
        price: number;
        currency: string;
    };
    userSignin: (email: string, password: string, rememberMe: boolean) => void;
};

type State = {
    addressView: string;
    isSpecialCodeValid: boolean;
    cardError?: string;
};

class Subscribe extends React.Component<WithApolloClient<Props & ReactStripeElements.InjectedStripeProps>, State> {
    public state: State = {
        addressView: 'shipping',
        isSpecialCodeValid: false,
    };

    public render() {
        const { subscribeForm } = this.props;
        const { addressView, isSpecialCodeValid } = this.state;
        const quarterFull: boolean = getConfig().publicRuntimeConfig.IS_QUARTERFULL;
        return (
            <Form
                onSubmit={this.handleSubmit}
                initialValues={subscribeForm || { shipping: {}, billing: {}, shippingAsBilling: true }}
            >
                {({ handleSubmit, submitting, values, submitError, submitErrors }) => (
                    <form className="modal-two-col-container subscribe" onSubmit={handleSubmit}>
                        <FormSpy onChange={this.onFormChange} />
                        <div className="modal-two-col-first-container modal-two-col-item-container">
                            <h1 className="modal-two-col-title">{!quarterFull ? 'Become a Kraken' : 'Pre-pay'}</h1>
                            <div className="modal-two-col-content">
                                <div className="modal-two-col-content-description" data-size="fs-regular">
                                    {quarterFull && (
                                        <p className="modal-two-col-content-description-paragraph">
                                            Pre-pay your membership now and be sure to become a Kraken from{' '}
                                            {getConfig().publicRuntimeConfig.NEXT_QUARTER_START} to{' '}
                                            {getConfig().publicRuntimeConfig.NEXT_QUARTER_END}.
                                        </p>
                                    )}
                                    {!quarterFull
                                        ? `On ${getConfig().publicRuntimeConfig.NEXT_QUARTER_START}`
                                        : `On ${getConfig().publicRuntimeConfig.NEXT_QUARTER_END}`}
                                    , your membership will be automatically renewed. Of course, you can cancel anytime.
                                </div>
                                <div className="subscribe-payment-line">
                                    <p className="subscribe-payment-line-title">Club membership:</p>
                                    <div className="subscribe-payment-line-separator" />
                                    <span className="subscribe-payment-line-price">
                                        {getPricingText(
                                            String(this.props.payment.price / 100),
                                            this.props.payment.currency,
                                        )}
                                    </span>
                                </div>
                                <div className="form-element" data-element-name="creditCard">
                                    <div className="form-element-field">
                                        <CardElement />
                                        {this.state.cardError && <ErrorMessage message={this.state.cardError} />}
                                        {submitErrors && submitErrors.card && (
                                            <ErrorMessage message={submitErrors.card} />
                                        )}
                                    </div>
                                </div>
                                <div id="subscribe-special-code">
                                    <Field
                                        name="special"
                                        placeholder="Special code - optional"
                                        validate={this.checkSpecial}
                                    />
                                    {isSpecialCodeValid && <IconValid />}
                                </div>
                                <div className="form-element">
                                    <label htmlFor="agreeTC" className="checkbox-container">
                                        I understand & accept that my membership will be automatically renewed on{' '}
                                        {!quarterFull
                                            ? `${getConfig().publicRuntimeConfig.NEXT_QUARTER_START}`
                                            : `${getConfig().publicRuntimeConfig.NEXT_QUARTER_END}`}
                                        <ReactField id="agreeTC" name="agreeTC" type="checkbox" component="input" />
                                        {submitErrors && submitErrors.agreeTC && (
                                            <ErrorMessage message={submitErrors.agreeTC} />
                                        )}
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
                            <div className="subscribe-legal" style={{ display: 'none' }}>
                                <Link href="/terms-and-conditions">
                                    <a className="subscribe-legal-link">Terms and conditions</a>
                                </Link>
                            </div>
                            <div className="modal-two-col-container-separator" />
                        </div>
                        <div className="modal-two-col-second-container modal-two-col-item-container">
                            <div className="modal-two-col-subtitles-container">
                                <button
                                    type="button"
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
                                        type="button"
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
                            <ButtonPrimary
                                type="submit"
                                className="button-primary modal-two-col-form-submit"
                                disabled={submitting}
                                loading={submitting}
                                loadingContent="Paying"
                            >
                                Pay{' '}
                                {getPricingText(String(this.props.payment.price / 100), this.props.payment.currency)}
                            </ButtonPrimary>
                        </div>
                    </form>
                )}
            </Form>
        );
    }

    private handleSubmit = async (values: any) => {
        if (!values.shipping) {
            values.shipping = {};
        }

        if (!values.shippingAsBilling && !values.billing) {
            values.billing = {};
        }

        const errors = validateForm(values);
        if (
            !values.shippingAsBilling &&
            Object.keys(values.billing).length <= 0 &&
            this.state.addressView === 'shipping'
        ) {
            errors[FORM_ERROR] =
                'Hey 👋 - one quick thing - give us your billing address or use your shipping address as billing address';
        }

        if (Object.keys(errors).length > 0) {
            return errors;
        }

        const { accountForm, stripe } = this.props;

        if (accountForm.email) {
            accountForm.email = accountForm.email.toLowerCase();
        }

        const data: { [key: string]: any } = {
            email: accountForm.email,
            firstName: accountForm.firstName,
            lastName: accountForm.lastName,
            password: accountForm.password,
            special: values.special,
            shippingAddress: {
                ...values.shipping,
                country: values.shipping.country.value,
            },
        };

        try {
            const address = values.shippingAsBilling ? values.shipping : values.billing;
            const response = await stripe.createToken({
                name: `${accountForm.firstName} ${accountForm.lastName}`,
                address_line1: address.line1,
                address_line2: address.line2,
                address_city: address.city,
                address_state: address.state,
                address_zip: address.postalCode,
                address_country: address.country.value,
            });
            const { token, error } = response;
            if (error) {
                this.setState({ cardError: error.message });
                return;
            }

            // Once done we can save the token in the data
            data.stripeToken = token.id;
        } catch (error) {
            this.setState({ cardError: error.message });
            return;
        }

        try {
            await this.props.client.mutate({
                mutation: JOIN_CLUB,
                variables: { data },
                update: (_cache, result) => {
                    const joinClubData = result.data as any;
                    Analytics.default().trackOrder(joinClubData.id, this.props.payment.price / 100);
                    this.props.onNextClick();
                    this.props.userSignin(data.email, data.password, true);
                },
            });
        } catch (error) {
            if (error.graphQLErrors) {
                if (!(error.graphQLErrors instanceof Array)) {
                    return { [FORM_ERROR]: error.graphQLErrors };
                }
                return error.graphQLErrors[0].state;
            }
            return { [FORM_ERROR]: 'We could not register your account or payment, try later' };
        }
    };

    private onFormChange = (props: FormSpyRenderProps) => {
        if (checkPath(props, 'values.shipping.country.value')) {
            const countryCode = props.values.shipping.country.value;
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

        this.props.updateFormState('subscribe', props.values);
    };

    private toggleAddressView = () => {
        if (this.state.addressView === 'billing') {
            this.setState({ addressView: 'shipping' });
        } else {
            this.setState({ addressView: 'billing' });
        }
    };

    private checkSpecial = async value => {
        if (value) {
            const result = await this.props.client.query<any>({
                query: CHECK_SPECIAL,
                variables: { code: value },
            });
            const { checkSpecial } = result.data;
            this.setState({ isSpecialCodeValid: checkSpecial });
        } else {
            this.setState({ isSpecialCodeValid: false });
        }
    };
}

const validateForm = (values: any) => {
    const errors: { [key: string]: any } = {};
    const shippingErrors: { [key: string]: string } = {};

    if (!values.agreeTC) {
        errors.agreeTC = 'Required';
    }

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
        userSignin,
    },
)(injectStripe(withApollo<Props>(Subscribe)));
