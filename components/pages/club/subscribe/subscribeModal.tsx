import React from 'react';
import { connect } from 'react-redux';

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

class SubscribeModal extends React.Component<Props, State> {
    public state: State = {
        step: 'account',
    };

    public render() {
        const { open } = this.props;
        const { step } = this.state;
        return (
            <>
                <Modal open={open} onClose={this.onClose} closeOnEsc={false}>
                    {step === 'account' && <CreateAccount quarterFull={true} onNextClick={this.onNextStep} />}
                    {step === 'subscribe' && <Subscribe quarterFull={true} onNextClick={this.onNextStep} />}
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
    };
}

export default connect(
    undefined,
    { resetForm },
)(SubscribeModal);
