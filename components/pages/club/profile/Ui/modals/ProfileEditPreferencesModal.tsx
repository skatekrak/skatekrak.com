import { FORM_ERROR } from 'final-form';
import gql from 'graphql-tag';
import React from 'react';
import { ChildProps, graphql } from 'react-apollo';
import { Form } from 'react-final-form';

import ProfileEditModal from 'components/pages/club/profile/Ui/editModal';

import ErrorMessage from 'components/Ui/Form/ErrorMessage';
import Field from 'components/Ui/Form/Field';

type Props = {
    preferences: any[];
    preferencesSetting: any[];
    open: boolean;
    onClose: () => void;
};

class ProfileEditPreferencesModal extends React.Component<Props & ChildProps> {
    public render() {
        return (
            <ProfileEditModal modalTitle="Edit preferences" open={this.props.open} onClose={this.props.onClose}>
                <div>Hello World</div>
            </ProfileEditModal>
        );
    }
}

export default ProfileEditPreferencesModal;
