import Head from 'next/head';
import React from 'react';

import Congrats from 'components/pages/club/subscribe/steps/congrats';
import CreateAccount from 'components/pages/club/subscribe/steps/createAccount';
import Subscribe from 'components/pages/club/subscribe/steps/subscribe';
import Modal from 'components/Ui/Modal';

type Props = {
    open: boolean;
    onClose: () => void;
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
        step: 'congrats',
    };

    public render() {
        const { open, onClose } = this.props;
        const { step } = this.state;
        return (
            <>
                <SubscribeHead />
                <Modal open={open} onClose={onClose}>
                    {step === 'account' && <CreateAccount quarterFull={false} onNextClick={this.onNextStep} />}
                    {step === 'subscribe' && <Subscribe quarterFull={false} onNextClick={this.onNextStep} />}
                    {step === 'congrats' && <Congrats onNextClick={this.onNextStep} />}
                </Modal>
            </>
        );
    }

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

export default SubscribeModal;
