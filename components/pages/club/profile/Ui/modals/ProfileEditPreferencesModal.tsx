import { FORM_ERROR, FormApi } from 'final-form';
import gql from 'graphql-tag';
import React from 'react';
import { ChildProps, graphql } from 'react-apollo';
import { Form } from 'react-final-form';

import ProfileEditModal from 'components/pages/club/profile/Ui/editModal';

import ErrorMessage from 'components/Ui/Form/ErrorMessage';
import Field from 'components/Ui/Form/Field';
import Select from 'components/Ui/Form/Select';

import { GET_ME } from 'pages/club/profile';

type Props = {
    memberId: string;
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
                    if (preference.options.length === 1) {
                        formattedInitialValues[preference.preferenceSetting.id] = {
                            value: preference.options[0].id,
                            label: preference.options[0].title,
                        };
                    }
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
                <Form onSubmit={this.handleSubmit} initialValues={formattedInitialValues}>
                    {({ handleSubmit, submitting, submitError }) => (
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
                                            key={preferenceSetting.id}
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
                                            key={preferenceSetting.id}
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
                            <button
                                className="button-primary profile-modal-form-submit"
                                disabled={submitting}
                                type="submit"
                            >
                                Save
                            </button>
                        </form>
                    )}
                </Form>
            </ProfileEditModal>
        );
    }

    private handleSubmit = async (values: any, formApi: FormApi) => {
        const { mutate } = this.props;
        if (mutate) {
            const fields = formApi.getRegisteredFields();
            // We get the modified values
            const dirtyValues = {};
            for (const key of fields) {
                if (formApi.getFieldState(key).dirty) {
                    dirtyValues[key] = values[key];
                }
            }

            const formattedPreferences: {
                id?: string;
                settingId: string;
                options?: string[];
                content?: string;
            }[] = [];

            // For each value that needs to be updated, we add a formatted preference to be sent
            for (const key of Object.keys(dirtyValues)) {
                if (!dirtyValues[key]) {
                    formattedPreferences.push({
                        settingId: key,
                        options: [],
                        content: '',
                    });
                } else if (dirtyValues[key] instanceof Array) {
                    // This case is for MULTIPLE
                    formattedPreferences.push({
                        settingId: key,
                        options: dirtyValues[key].map((value) => value.value),
                    });
                } else if (typeof dirtyValues[key] === 'string') {
                    // OPEN
                    formattedPreferences.push({
                        settingId: key,
                        content: dirtyValues[key],
                    });
                } else if (dirtyValues[key].value) {
                    // ENUM
                    formattedPreferences.push({
                        settingId: key,
                        options: [dirtyValues[key].value],
                    });
                }
            }

            try {
                await mutate({
                    variables: {
                        memberId: this.props.memberId,
                        preferences: formattedPreferences,
                    },
                    update: (cache, result) => {
                        const query = cache.readQuery<any>({
                            query: GET_ME,
                        });
                        const data = result.data as any;
                        if (query && data) {
                            /* To update the cache we check if we have a new preference for
                            existing preference, then replace or add them
                            */
                            for (const preference of data.addOrUpdatePreferences) {
                                const existingIndex = query.me.preferences.findIndex(
                                    (pref) => pref.id === preference.id,
                                );
                                if (existingIndex >= 0) {
                                    query.me.preferences[existingIndex] = preference;
                                } else {
                                    query.me.preferences.push(preference);
                                }
                            }

                            cache.writeQuery({
                                query: GET_ME,
                                data: {
                                    me: query.me,
                                },
                            });
                        }
                    },
                });

                this.props.onClose();
            } catch (error) {
                if (error.graphQLErrors) {
                    if (!(error.graphQLErrors instanceof Array)) {
                        return { [FORM_ERROR]: error.graphQLErrors };
                    }
                    return error.graphQLErrors[0].state;
                }
                return { [FORM_ERROR]: 'We could not update your preferences' };
            }
        }
    };
}

const ADD_UPDATE_PREFERENCES = gql`
    mutation addOrUpdatePreferences($memberId: ID!, $preferences: [AddOrUpdatePreferenceInput!]!) {
        addOrUpdatePreferences(memberId: $memberId, preferences: $preferences) {
            id
            preferenceSetting {
                id
                name
                type
            }
            options {
                id
                title
            }
            content
        }
    }
`;

export default graphql<Props>(ADD_UPDATE_PREFERENCES)(ProfileEditPreferencesModal);
