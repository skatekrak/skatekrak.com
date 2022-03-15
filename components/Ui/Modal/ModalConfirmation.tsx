/*
 * Npm import
 */
import React, { useState } from 'react';
import { render } from 'react-dom';

/*
 * Local import
 */
import ButtonPrimary from 'components/Ui/Button/ButtonPrimary/ButtonPrimary';
import Modal from 'components/Ui/Modal';

/*
 * Code
 */
type Props = {
    onClose?: () => void;
    title: string;
    message: string;
    buttons: { label: string; onClick?: () => void }[];
};

const ModalConfirmation = ({ onClose, title, message, buttons }: Props) => {
    const [open, setOpen] = useState(true);

    const close = () => {
        setOpen(false);
        if (onClose) {
            onClose();
        }
    };

    const btnClick = (fct?: () => void) => {
        if (fct) {
            fct();
        }
        close();
    };

    // tslint:disable:jsx-no-lambda
    return (
        <Modal open={open} onClose={close}>
            <div className="modal-confirmation">
                <p className="modal-confirmation-title">{title}</p>
                <p className="modal-confirmation-message">{message}</p>
                <div className="modal-confirmation-buttons">
                    {buttons.map((button) => (
                        <ButtonPrimary
                            key={button.label}
                            className="button-primary modal-confirmation-button"
                            onClick={() => btnClick(button.onClick)}
                        >
                            {button.label}
                        </ButtonPrimary>
                    ))}
                </div>
            </div>
        </Modal>
    );
    // tslint:enable:jsx-no-lambda
};

export function showConfirmation(props: Props) {
    const divTarget = document.createElement('div');
    divTarget.id = 'modal-confirmation';
    document.body.appendChild(divTarget);
    render(<ModalConfirmation {...props} />, divTarget);
}
