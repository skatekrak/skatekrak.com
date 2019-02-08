import { FORM_ERROR } from 'final-form';
import gql from 'graphql-tag';
import React from 'react';
import { ChildProps, graphql } from 'react-apollo';
import { Field as ReactField, Form } from 'react-final-form';

import ProfileEditModal from 'components/pages/club/profile/Ui/editModal';

import ErrorMessage from 'components/Ui/Form/ErrorMessage';
import Field from 'components/Ui/Form/Field';
import Select from 'components/Ui/Form/Select';

type Props = {
    preferences: any[];
    preferencesSetting: any[];
    open: boolean;
    onClose: () => void;
};

class ProfileEditPreferencesModal extends React.Component<Props & ChildProps> {
    public render() {
        const formattedInitialValues: { [key: string]: any } = {};
        for (const preference of this.props.preferences) {
            switch (preference.preferenceSetting.type) {
                case 'ENUM':
                    formattedInitialValues[preference.preferenceSetting.id] = {
                        value: preference.options[0].id,
                        label: preference.options[0].title,
                    };
                    break;
                case 'MULTIPLE':
                    formattedInitialValues[preference.preferenceSetting.id] = preference.options.map((option) => ({
                        value: option.id,
                        label: option.title,
                    }));
                    break;
                case 'OPEN':
                    formattedInitialValues[preference.preferenceSetting.id] = preference.content;
            }
        }

        return (
            <ProfileEditModal modalTitle="Edit preferences" open={this.props.open} onClose={this.props.onClose}>
                <Form onSubmit={this.handleSubmit} validate={validateForm} initialValues={formattedInitialValues}>
                    {({ handleSubmit, submitting, submitError, values }) => (
                        <form className="profile-modal-form" onSubmit={handleSubmit}>
                            {submitError && <ErrorMessage message={submitError} />}
                            {this.props.preferencesSetting.map((preferenceSetting) => {
                                if (preferenceSetting.type === 'OPEN') {
                                    return (
                                        <Field
                                            key={preferenceSetting.id}
                                            name={preferenceSetting.id}
                                            label={preferenceSetting.name}
                                        />
                                    );
                                } else if (preferenceSetting.type === 'ENUM') {
                                    return (
                                        <Select
                                            name={preferenceSetting.id}
                                            label={preferenceSetting.name}
                                            options={preferenceSetting.options.map((option) => ({
                                                value: option.id,
                                                label: option.title,
                                            }))}
                                        />
                                    );
                                } else if (preferenceSetting.type === 'MULTIPLE') {
                                    return (
                                        <Select
                                            name={preferenceSetting.id}
                                            label={preferenceSetting.name}
                                            options={preferenceSetting.options.map((option) => ({
                                                value: option.id,
                                                label: option.title,
                                            }))}
                                            isMulti
                                        />
                                    );
                                }
                            })}
                            <button className="button-primary profile-modal-form-submit" disabled={submitting}>
                                Save
                            </button>
                        </form>
                    )}
                </Form>
            </ProfileEditModal>
        );
    }

    private handleSubmit = async (values: any) => {
        //
    };
}

const validateForm = (values: any) => {
    const errors: any = {};
    return errors;
};

export default ProfileEditPreferencesModal;
