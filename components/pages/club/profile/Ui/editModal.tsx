import Modal from 'components/Ui/Modal';
import React from 'react';

type Props = {
    modalTitle: string;
    open: boolean;
    onClose: () => void;
};

const ProfileEditModal: React.SFC<Props> = ({ modalTitle, children, open, onClose }) => (
    <Modal open={open} onClose={onClose}>
        <div className="profile-modal">
            <h2 className="profile-modal-title">{modalTitle}</h2>
            {children}
        </div>
    </Modal>
);

export default ProfileEditModal;
