import React from 'react';
import { connect } from 'react-redux';

import CreateAccount from 'components/pages/club/subscribe/steps/createAccount';
import Subscribe from 'components/pages/club/subscribe/steps/subscribe';
import Summary from 'components/pages/club/subscribe/steps/summary';
import Modal from 'components/Ui/Modal';

import { resetForm } from 'store/form/actions';

type Props = {
    open: boolean;
    onClose: () => void;
    resetForm: () => void;
    modalStep?: string;
};

type State = {
    step: string;
};

class SubscribeModal extends React.Component<Props, State> {
    public state: State = {
        step: 'summary',
    };

    public componentDidUpdate(prevProps) {
        if (prevProps.modalStep !== this.props.modalStep) {
            this.setState({ step: this.props.modalStep });
        }
    }

    public render() {
        const { open } = this.props;
        const { step } = this.state;
        return (
            <>
                <Modal open={open} onClose={this.onClose} closeOnEsc={false}>
                    {step === 'summary' && <Summary onNextClick={this.onNextStep} />}
                    {step === 'account' && <CreateAccount onNextClick={this.onNextStep} />}
                    {step === 'subscribe' && <Subscribe onNextClick={this.onNextStep} />}
                </Modal>
            </>
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
