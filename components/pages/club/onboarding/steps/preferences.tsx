import { FORM_ERROR, FormApi } from 'final-form';
import gql from 'graphql-tag';
import React from 'react';
import { ChildProps, graphql, Query } from 'react-apollo';
import { Form } from 'react-final-form';

import Loading from 'components/pages/news/Articles/Loading';
import ErrorMessage from 'components/Ui/Form/ErrorMessage';
import Field from 'components/Ui/Form/Field';
import Select from 'components/Ui/Form/Select';
import Emoji from 'components/Ui/Icons/Emoji';

import { GET_ME } from 'pages/club/profile';

type Props = {
    onNextClick: () => void;
    profile: any;
};

const PreferenceSettingField = ({ preferenceSetting }: { preferenceSetting: any }) => {
    if (preferenceSetting.type === 'OPEN') {
        return <Field name={preferenceSetting.id} label={preferenceSetting.name} />;
    } else if (preferenceSetting.type === 'ENUM') {
        return (
            <Select
                name={preferenceSetting.id}
                label={preferenceSetting.name}
                options={preferenceSetting.options.map(option => ({
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
                options={preferenceSetting.options.map(option => ({
                    value: option.id,
                    label: option.title,
                }))}
                isMulti
            />
        );
    } else {
        return <></>;
    }
};

class Preferences extends React.Component<Props & ChildProps> {
    public render() {
        const { profile, onNextClick } = this.props;
        return (
            <Query query={GET_PREFERENCES_SETTING} variables={{ memberId: profile.id }}>
                {({ data, loading, error }) => {
                    if (loading) {
                        return <Loading />;
                    }
                    if (error) {
                        return <pre>{JSON.stringify(error, undefined, 2)}</pre>;
                    }

                    let preferencesSettingFirstPart;
                    let preferencesSettingSecondPart;
                    if (data && data.getPreferencesSetting) {
                        const length = data.getPreferencesSetting.length;
                        preferencesSettingFirstPart = data.getPreferencesSetting.slice(0, Math.round(length / 4));
                        preferencesSettingSecondPart = data.getPreferencesSetting.slice(Math.round(length / 4), length);
                    }
                    return (
                        <Form onSubmit={this.handleSubmit}>
                            {({ handleSubmit, submitting, submitError }) => (
                                <form
                                    className="onboarding onboarding-preference modal-two-col-container modal-two-col-form"
                                    onSubmit={handleSubmit}
                                >
                                    <div className="modal-two-col-first-container modal-two-col-item-container">
                                        <h1 className="modal-two-col-title">Preference</h1>
                                        <div className="modal-two-col-content">
                                            <p className="modal-two-col-content-description">
                                                Better to get the right sizes before shipping anything. Tell us what you
                                                wear / ride.
                                                <br />
                                                As far as you know <Emoji symbol="🤷‍♂️" label="I dont know" />
                                            </p>
                                            {submitError && <ErrorMessage message={submitError} />}
                                            {preferencesSettingFirstPart &&
                                                preferencesSettingFirstPart.map(preferenceSetting => (
                                                    <PreferenceSettingField
                                                        key={preferenceSetting.id}
                                                        preferenceSetting={preferenceSetting}
                                                    />
                                                ))}
                                        </div>
                                    </div>
                                    <div className="modal-two-col-second-container modal-two-col-item-container">
                                        <div className="modal-two-col-content">
                                            {preferencesSettingSecondPart &&
                                                preferencesSettingSecondPart.map(preferenceSetting => (
                                                    <PreferenceSettingField
                                                        key={preferenceSetting.id}
                                                        preferenceSetting={preferenceSetting}
                                                    />
                                                ))}
                                        </div>
                                        <button
                                            onClick={onNextClick}
                                            className="button-primary modal-two-col-form-submit"
                                            disabled={submitting}
                                            type="submit"
                                        >
                                            Finish
                                        </button>
                                    </div>
                                </form>
                            )}
                        </Form>
                    );
                }}
            </Query>
        );
    }

    private handleSubmit = async (_values: any, formApi: FormApi) => {
        const { mutate } = this.props;
        if (mutate) {
            const fields = formApi.getRegisteredFields();
            const values: any = {};

            for (const field of fields) {
                values[field] = formApi.getFieldState(field).value;
            }

            const formattedPreferences: {
                settingId: string;
                options?: string[];
                content?: string;
            }[] = [];

            for (const key of Object.keys(values)) {
                if (!values[key]) {
                    formattedPreferences.push({
                        settingId: key,
                        options: [],
                        content: '',
                    });
                } else if (values[key] instanceof Array) {
                    // This case is for MULTIPLE
                    formattedPreferences.push({
                        settingId: key,
                        options: values[key].map(value => value.value),
                    });
                } else if (typeof values[key] === 'string') {
                    // OPEN
                    formattedPreferences.push({
                        settingId: key,
                        content: values[key],
                    });
                } else if (values[key].value) {
                    // ENUM
                    formattedPreferences.push({
                        settingId: key,
                        options: [values[key].value],
                    });
                }
            }

            try {
                await mutate({
                    variables: {
                        memberId: this.props.profile.id,
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
                            query.me.onboarding = true;
                            for (const preference of data.addOrUpdatePreferences) {
                                const existingIndex = query.me.preferences.findIndex(pref => pref.id === preference.id);
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

                this.props.onNextClick();
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

const GET_PREFERENCES_SETTING = gql`
    query getPreferencesSetting($memberId: ID!) {
        getPreferencesSetting(memberId: $memberId) {
            id
            name
            type
            options(orderBy: order_ASC) {
                id
                title
            }
        }
    }
`;

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

export default graphql<Props>(ADD_UPDATE_PREFERENCES)(Preferences);
