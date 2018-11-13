import axios from 'axios';
import classNames from 'classnames';
import React from 'react';
import { Field, InjectedFormProps, reduxForm, SubmissionError } from 'redux-form';

import validate from 'components/pages/club/validate';
import Address from 'components/Ui/Form/Address';
import RenderInput from 'components/Ui/Form/Input';

// TODO: Find how to properly put props here (with InjectedFormProps)
interface Props {
    onSubmit: () => void;
    countries: {
        value: string;
        label: string;
    }[];
}

type InjectedProps = InjectedFormProps<{}, Props>;

class ShippingForm extends React.Component<Props & InjectedProps> {
    public render() {
        const { countries, handleSubmit } = this.props;
        return (
            <form id="checkout-form-shipping" className="checkout-form" onSubmit={handleSubmit(this.afterFormIsValid)}>
                <div className="row">
                    <div className="form-section col-xs-12 col-md-6">
                        <p className="form-section-title">Shipping information</p>
                        <p className="form-section-description">
                            Give us your shipping information so we can send you the best skateboard right on your
                            doorstep!
                        </p>
                        <div className="checkout-form-fields-container">
                            <Field name="email" component={RenderInput} type="email" label="Email address" />
                            <Address countries={countries} />
                        </div>
                    </div>
                    <div className="form-section col-xs-12 col-md-offset-1 col-md-5">
                        <button
                            className={classNames('checkout-form-submit-button', {
                                'checkout-form-submit-button--enable': !(!this.props.valid || this.props.submitting),
                            })}
                            disabled={!this.props.valid || this.props.submitting}
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
                            src="static/images/step_1_2x.png"
                            alt="Kraken illustration step 1"
                        />
                    </div>
                </div>
            </form>
        );
    }

    private afterFormIsValid = (values) => {
        const { email } = values;
        return axios
            .get('http://localhost:3737/customers/find', {
                params: {
                    email,
                },
            })
            .then(() => this.props.onSubmit())
            .catch(() => {
                throw new SubmissionError({
                    email: 'Email is alreay taken',
                    _error: 'Failed',
                });
            });
    };
}

export default reduxForm({
    form: 'clubSignup',
    destroyOnUnmount: false,
    forceUnregisterOnUnmount: true,
    validate,
})(ShippingForm);
