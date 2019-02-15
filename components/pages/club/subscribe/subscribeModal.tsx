import Head from 'next/head';
import React from 'react';
import { connect } from 'react-redux';

import Congrats from 'components/pages/club/subscribe/steps/congrats';
import CreateAccount from 'components/pages/club/subscribe/steps/createAccount';
import Subscribe from 'components/pages/club/subscribe/steps/subscribe';
import Modal from 'components/Ui/Modal';

import { resetForm } from 'store/form/actions';

type Props = {
    open: boolean;
    onClose: () => void;
    resetForm: () => void;
};

type State = {
    step: string;
};

const SubscribeHead = () => (
    <Head>
        <title>Krak | Subscribe</title>
    </Head>
);

class SubscribeModal extends React.Component<Props, State> {
    public state: State = {
        step: 'subscribe',
    };

    public render() {
        const { open } = this.props;
        const { step } = this.state;
        return (
            <>
                <SubscribeHead />
                <Modal open={open} onClose={this.onClose}>
                    {step === 'account' && <CreateAccount quarterFull={false} onNextClick={this.onNextStep} />}
                    {step === 'subscribe' && <Subscribe quarterFull={false} onNextClick={this.onNextStep} />}
                    {step === 'congrats' && <Congrats quarterFull={false} onNextClick={this.onNextStep} />}
                </Modal>
            </>
        );
    }

    private onClose = () => {
        this.props.onClose();
        this.setState({ step: 'account' });
        this.props.resetForm();
    };

    private onNextStep = () => {
        const { step } = this.state;
        if (step === 'account') {
            this.setState({ step: 'subscribe' });
        }
        if (step === 'subscribe') {
            this.setState({ step: 'congrats' });
        }
        if (step === 'congrats') {
            // Run onboarding
        }
    };
}

export default connect(
    undefined,
    { resetForm },
)(SubscribeModal);
