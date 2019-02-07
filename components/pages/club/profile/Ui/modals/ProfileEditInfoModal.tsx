import React from 'react';

import ProfileEditModal from 'components/pages/club/profile/Ui/editModal';

type Props = {
    open: boolean;
    onClose: () => void;
};

class ProfileEditInfoModal extends React.Component<Props> {
    public render() {
        return (
            <ProfileEditModal modalTitle="Edit personal infos" open={this.props.open} onClose={this.props.onClose}>
                <form className="profile-modal-form">
                    <div className="form-element">
                        <div className="form-element-label">First name</div>
                        <div className="form-element-field">
                            <input type="text" placeholder="Guillaume" />
                        </div>
                    </div>
                    <button className="button-primary profile-modal-form-submit">Save</button>
                </form>
            </ProfileEditModal>
        );
    }
}

export default ProfileEditInfoModal;
