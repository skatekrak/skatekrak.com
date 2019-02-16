import Head from 'next/head';
import React from 'react';

import Preference from 'components/pages/club/onboarding/steps/preferences';
import Modal from 'components/Ui/Modal';

type Props = {
    profile: any;
};

type State = {
    step: string;
    open: boolean;
};

const OnboardingHead = () => (
    <Head>
        <title>Krak | Join the ride</title>
    </Head>
);

class OnboardingModal extends React.Component<Props, State> {
    public state: State = {
        step: 'preference',
        open: true,
    };

    public render() {
        const { profile } = this.props;
        const { open, step } = this.state;
        return (
            <React.Fragment>
                <OnboardingHead />
                <Modal open={open} onClose={this.onClose} closable={false}>
                    {step === 'preference' && <Preference profile={profile} onNextClick={this.onNextStep} />}
                </Modal>
            </React.Fragment>
        );
    }

    private onClose = () => {
        this.setState({ open: false });
    };

    private onNextStep = () => {
        const { step } = this.state;
        if (step === 'preference') {
            this.setState({ step: 'preference' });
        }
    };
}

export default OnboardingModal;
