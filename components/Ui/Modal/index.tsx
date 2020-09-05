import React from 'react';
import Modal, { Props as ReactResponseiveModalProps } from 'react-responsive-modal';
import '../../../node_modules/react-responsive-modal/styles.css';

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

const ModalWithStyle: React.FunctionComponent<Props> = ({ open, onClose, children, closable, ...props }) => (
    <Modal
        open={open}
        center
        closeOnEsc={closable}
        closeOnOverlayClick={closable}
        showCloseIcon={closable}
        classNames={classNames}
        closeIconSvgPath={<IconCross />}
        animationDuration={300}
        onClose={onClose}
        {...props}
    >
        {children}
    </Modal>
);

export default ModalWithStyle;
