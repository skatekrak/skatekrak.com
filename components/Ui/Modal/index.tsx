import React from 'react';
import Modal, { ReactResponseiveModalProps } from 'react-responsive-modal';

import IconCross from 'components/Ui/Icons/Cross';

/*
    Everytime you want to use a modal,
    use this one as a wrapper instead of the original.

    Goal: Reset styles

    Use :
        - Set the max-width of the popup with the children element
*/

const classNames = {
    overlay: 'modal-overlay',
    modal: 'modal-container',
    closeButton: 'modal-close-button',
};

type Props = {
    open: boolean;
    onClose: () => void;
    closable?: boolean;
} & Partial<ReactResponseiveModalProps>;

const ModalWithStyle: React.SFC<Props> = ({ open, onClose, children, closable, ...props }) => (
    <Modal
        open={open}
        onClose={onClose}
        classNames={classNames}
        closeIconSvgPath={<IconCross />}
        closeIconSize={24}
        animationDuration={300}
        closeOnEsc={closable}
        closeOnOverlayClick={closable}
        showCloseIcon={closable}
        {...props}
    >
        {children}
    </Modal>
);

export default ModalWithStyle;
