import getConfig from 'next/config';
import React from 'react';
import { connect } from 'react-redux';

import Congrats from 'components/pages/club/subscribe/steps/congrats';
import CreateAccount from 'components/pages/club/subscribe/steps/createAccount';
import Subscribe from 'components/pages/club/subscribe/steps/subscribe';
import Summary from 'components/pages/club/subscribe/steps/summary';
import Modal from 'components/Ui/Modal';

import { resetForm } from 'store/form/actions';

import { Elements, StripeProvider } from 'react-stripe-elements';

type Props = {
    open: boolean;
    onClose: () => void;
    resetForm: () => void;
    modalStep?: string;
};

type State = {
    step: string;
    stripe: any;
};

class SubscribeModal extends React.Component<Props, State> {
    public state: State = {
        step: 'summary',
        stripe: null,
    };

    public componentDidMount() {
        this.setState({
            stripe: (window as any).Stripe(getConfig().publicRuntimeConfig.STRIPE_KEY),
        });
    }

    public componentDidUpdate(prevProps) {
        if (prevProps.modalStep !== this.props.modalStep) {
            this.setState({ step: this.props.modalStep });
        }
    }

    public render() {
        const { open } = this.props;
        const { step } = this.state;
        return (
            <StripeProvider stripe={this.state.stripe}>
                <Elements>
                    <Modal open={open} onClose={this.onClose} closeOnEsc={false}>
                        {step === 'summary' && <Summary onNextClick={this.onNextStep} />}
                        {step === 'account' && <CreateAccount onNextClick={this.onNextStep} />}
                        {step === 'subscribe' && <Subscribe onNextClick={this.onNextStep} />}
                        {step === 'congrats' && <Congrats onNextClick={this.onClose} />}
                    </Modal>
                </Elements>
            </StripeProvider>
        );
    }

    private onClose = () => {
        this.props.onClose();
        this.setState({ step: 'summary' });
        this.props.resetForm();
    };

    private onNextStep = () => {
        const { step } = this.state;
        if (step === 'summary') {
            this.setState({ step: 'account' });
        }
        if (step === 'account') {
            this.setState({ step: 'subscribe' });
        }
        if (step === 'subscribe') {
            this.setState({ step: 'congrats' });
        }
    };
}

export default connect(
    undefined,
    { resetForm },
)(SubscribeModal);
