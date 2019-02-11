import gql from 'graphql-tag';
import React from 'react';
import { Query } from 'react-apollo';

import ProfileItem from 'components/pages/club/profile/Ui/item';
import ProfileEditPreferencesModal from 'components/pages/club/profile/Ui/modals/ProfileEditPreferencesModal';
import ProfileSection from 'components/pages/club/profile/Ui/section';
import ProfileSectionHeader from 'components/pages/club/profile/Ui/sectionHeader';
import Loading from 'components/pages/news/Articles/Loading';

const GET_PREFERENCES_SETTING = gql`
    query getPreferencesSetting($memberId: ID!) {
        getPreferencesSetting(memberId: $memberId) {
            id
            name
            type
            options {
                id
                title
            }
        }
    }
`;

type Props = {
    member: any;
};

type State = {
    modalOpen: boolean;
};

class ProfilePreferencesSection extends React.Component<Props, State> {
    public state: State = {
        modalOpen: false,
    };
    public render() {
        const { member } = this.props;
        return (
            <>
                <ProfileSection>
                    <Query query={GET_PREFERENCES_SETTING} variables={{ memberId: member.id }}>
                        {({ data, loading, error }) => (
                            <>
                                <ProfileSectionHeader
                                    title="Preferences"
                                    edit
                                    editTitle="Preferences"
                                    onEditClick={!loading && !error ? this.openModal : null}
                                />
                                {loading && <Loading />}
                                {error && <pre>{JSON.stringify(error, undefined, 2)}</pre>}
                                {data && data.getPreferencesSetting && (
                                    <>
                                        <ProfileEditPreferencesModal
                                            open={this.state.modalOpen}
                                            onClose={this.closeModal}
                                            memberId={member.id}
                                            preferences={member.preferences}
                                            preferencesSetting={data.getPreferencesSetting}
                                        />
                                        <div className="profile-section-line">
                                            {data.getPreferencesSetting.map((setting) => (
                                                <ProfileItem
                                                    key={setting.id}
                                                    title={setting.name}
                                                    content={getPreferenceWithSetting(setting, member.preferences)}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </Query>
                </ProfileSection>
            </>
        );
    }

    private closeModal = () => {
        this.setState({ modalOpen: false });
    };

    private openModal = () => {
        this.setState({ modalOpen: true });
    };
}

const getPreferenceWithSetting = (preferenceSetting: any, preferences: any[]): string => {
    for (const preference of preferences) {
        if (preference.preferenceSetting.id === preferenceSetting.id) {
            if (preference.options.length > 0) {
                return preference.options.map((option: any) => option.title).join(', ');
            }
            return preference.content;
        }
    }
    return '';
};

export default ProfilePreferencesSection;
