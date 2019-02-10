import React from 'react';
import Modal from 'react-responsive-modal';

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
} & Partial<JSX.LibraryManagedAttributes<typeof Modal, Modal['props']>>;

const ModalWithStyle: React.SFC<Props> = ({ open, onClose, children, ...props }) => (
    <Modal
        open={open}
        onClose={onClose}
        classNames={classNames}
        closeIconSvgPath={<IconCross />}
        closeIconSize={24}
        animationDuration={300}
        {...props}
    >
        {children}
    </Modal>
);

export default ModalWithStyle;
