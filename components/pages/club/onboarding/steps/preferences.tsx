import gql from 'graphql-tag';
import React from 'react';
import { ChildProps, Query } from 'react-apollo';
import { Form } from 'react-final-form';

import Loading from 'components/pages/news/Articles/Loading';
import ErrorMessage from 'components/Ui/Form/ErrorMessage';
import Field from 'components/Ui/Form/Field';
import Select from 'components/Ui/Form/Select';
import Emoji from 'components/Ui/Icons/Emoji';

type Props = {
    onNextClick: () => void;
    profile: any;
};

type State = {};

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

class Preference extends React.Component<Props & ChildProps, State> {
    public state: State = {};

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

    private handleSubmit = (evt: any) => {
        evt.preventDefault();
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

export default Preference;
