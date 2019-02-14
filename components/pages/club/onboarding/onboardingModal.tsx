import Head from 'next/head';
import React from 'react';

import Preference from 'components/pages/club/onboarding/steps/preferences';
import Modal from 'components/Ui/Modal';

type Props = {
    open: boolean;
    onClose: () => void;
};

type State = {
    step: string;
};

const OnboardingHead = () => (
    <Head>
        <title>Krak | Join the ride</title>
    </Head>
);

class OnboardingModal extends React.Component<Props, State> {
    public state: State = {
        step: 'preference',
    };

    public render() {
        const { open, onClose } = this.props;
        const { step } = this.state;
        return (
            <>
                <OnboardingHead />
                <Modal open={open} onClose={onClose}>
                    {step === 'preference' && <Preference onNextClick={this.onNextStep} />}
                </Modal>
            </>
        );
    }

    private onNextStep = () => {
        const { step } = this.state;
        if (step === 'preference') {
            this.setState({ step: 'preference' });
        }
    };
}

export default OnboardingModal;
