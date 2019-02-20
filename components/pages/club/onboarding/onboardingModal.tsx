import Head from 'next/head';
import React from 'react';

import Preference from 'components/pages/club/onboarding/steps/preferences';
import Congrats from 'components/pages/club/subscribe/steps/congrats';
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
        step: 'congrats',
        open: true,
    };

    public render() {
        const { profile } = this.props;
        const { open, step } = this.state;
        return (
            <React.Fragment>
                <OnboardingHead />
                <Modal open={open} onClose={this.onClose} closable={false}>
                    {step === 'congrats' && <Congrats quarterFull={false} onNextClick={this.onNextStep} />}
                    {step === 'preferences' && <Preference profile={profile} onNextClick={this.onNextStep} />}
                </Modal>
            </React.Fragment>
        );
    }

    private onClose = () => {
        this.setState({ open: false });
    };

    private onNextStep = () => {
        const { step } = this.state;
        if (step === 'congrats') {
            this.setState({ step: 'preferences' });
        } else if (step === 'preferences') {
            this.onClose();
        }
    };
}

export default OnboardingModal;
