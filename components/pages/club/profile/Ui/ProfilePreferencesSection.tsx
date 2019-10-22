import gql from 'graphql-tag';
import React, { useState } from 'react';
import { Query, useQuery } from 'react-apollo';

import ProfileItem from 'components/pages/club/profile/Ui/item';
import ProfileEditPreferencesModal from 'components/pages/club/profile/Ui/modals/ProfileEditPreferencesModal';
import ProfileSection from 'components/pages/club/profile/Ui/section';
import ProfileSectionHeader from 'components/pages/club/profile/Ui/sectionHeader';
import { KrakLoading } from 'components/Ui/Icons/Spinners';

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

const ProfilePreferencesSection = ({ member }: Props) => {
    const [modalOpen, setModalOpen] = useState(false);
    const { loading, error, data } = useQuery(GET_PREFERENCES_SETTING, { variables: { memberId: member.id } });

    const openModal = () => {
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    return (
        <ProfileSection>
            <ProfileSectionHeader
                title="Preferences"
                edit
                editTitle="Preferences"
                onEditClick={!loading && !error ? openModal : null}
            />
            {loading && (
                <div className="profile-preferences-loader">
                    <KrakLoading />
                </div>
            )}
            {data && data.getPreferencesSetting && (
                <>
                    <ProfileEditPreferencesModal
                        open={modalOpen}
                        onClose={closeModal}
                        memberId={member.id}
                        preferences={member.preferences}
                        preferencesSetting={data.getPreferencesSetting}
                    />
                    {data.getPreferencesSetting.map(setting => (
                        <div key={setting.id} className="profile-section-line">
                            <ProfileItem
                                title={setting.name}
                                content={getPreferenceWithSetting(setting, member.preferences)}
                            />
                        </div>
                    ))}
                </>
            )}
        </ProfileSection>
    );
};

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
