/*
 * Npm import
 */
import React from 'react';

/*
 * Local import
 */
import ButtonPrimary from 'components/Ui/Button/ButtonPrimary';
import Modal from 'components/Ui/Modal';

/*
 * Code
 */
type Props = {
    open: boolean;
    onClose: () => void;
    title: string;
    message: string;
    buttons: { label: string; onClick: () => void }[];
};

const ModalConfirmation: React.SFC<Props> = ({ open, onClose, title, message, buttons }) => (
    <Modal open={open} onClose={onClose}>
        <div className="modal-confirmation">
            <p className="modal-confirmation-title">{title}</p>
            <p className="modal-confirmation-message">{message}</p>
            <div className="modal-confirmation-buttons">
                {buttons.map((button) => (
                    <ButtonPrimary
                        key={button.label}
                        className="button-primary modal-confirmation-button"
                        onClick={button.onClick}
                    >
                        {button.label}
                    </ButtonPrimary>
                ))}
            </div>
        </div>
    </Modal>
);

/*
 * Export Default
 */
export default ModalConfirmation;
