import React from 'react';
import Modal, { ModalProps } from 'react-responsive-modal';

import IconCross from 'components/Ui/Icons/Cross';

/*
    Everytime you want to use a modal,
    use this one as a wrapper instead of the original.

    Goal: Reset styles

    Use :
        - Set the max-width of the popup with the children element
*/

let classNames = {
    overlay: 'modal-overlay',
    modal: 'modal-container',
    closeButton: 'modal-close-button',
};

type Props = {
    open: boolean;
    onClose: () => void;
    closable?: boolean;
    customClassNames?: {
        customOverlay?: string;
        customModal?: string;
        customCloseButton?: string;
    };
} & Partial<ModalProps>;

const ModalWithStyle: React.FunctionComponent<Props> = ({
    open,
    onClose,
    children,
    closable,
    customClassNames,
    ...props
}) => {
    if (customClassNames) {
        classNames = {
            overlay: classNames.overlay + ' ' + customClassNames.customOverlay,
            modal: classNames.modal + ' ' + customClassNames.customModal,
            closeButton: classNames.closeButton + ' ' + customClassNames.customCloseButton,
        };
    }
    return (
        <Modal
            open={open}
            center
            closeOnEsc={closable}
            closeOnOverlayClick={closable}
            showCloseIcon={closable}
            classNames={classNames}
            closeIcon={<IconCross />}
            animationDuration={300}
            onClose={onClose}
            {...props}
        >
            {children}
        </Modal>
    );
};

export default ModalWithStyle;
