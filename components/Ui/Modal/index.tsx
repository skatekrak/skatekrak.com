import React from 'react';
import Modal from 'react-responsive-modal';

import IconCross from 'components/Ui/Icons/Cross';

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
        {...props}
    >
        {children}
    </Modal>
);

export default ModalWithStyle;
