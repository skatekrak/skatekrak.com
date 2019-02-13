import format from 'date-fns/format';
import gql from 'graphql-tag';
import React from 'react';
import { Query } from 'react-apollo';

import Layout from 'components/Layout/Layout';
import LayoutProfile from 'components/pages/club/profile/LayoutProfile';
import ProfileItem from 'components/pages/club/profile/Ui/item';
import ProfileEditInfoModal from 'components/pages/club/profile/Ui/modals/ProfileEditInfoModal';
import ProfileSection from 'components/pages/club/profile/Ui/section';
import ProfileSectionHeader from 'components/pages/club/profile/Ui/sectionHeader';
import TrackedPage from 'components/pages/TrackedPage';

import Loading from 'components/pages/news/Articles/Loading';

import withAuth from 'hocs/withAuth';

import 'static/styles/form.styl';

export const GET_ME = gql`
    query {
        me {
            id
            firstName
            lastName
            email
            createdAt
            birthday
            phone
            addresses {
                id
                title
                firstName
                lastName
                line1
                line2
                city
                postalCode
                state
                country {
                    isoCode
                    name
                }
                default
            }
            preferences {
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
    }
`;

type State = {
    modalOpenName?: 'personalInfo';
};

class ProfileMain extends React.Component<{}, State> {
    public state: State = {
        modalOpenName: undefined,
    };

    public render() {
        return (
            <TrackedPage name="Club/Profile">
                <Layout>
                    <Query query={GET_ME}>
                        {({ loading, error, data }) => {
                            if (loading) {
                                return <Loading />;
                            }

                            if (error) {
                                return <pre>{JSON.stringify(error, undefined, 2)}</pre>;
                            }

                            if (data) {
                                return (
                                    <LayoutProfile profile={data.me} view="profile">
                                        <ProfileEditInfoModal
                                            open={this.state.modalOpenName === 'personalInfo'}
                                            onClose={this.onCloseModal}
                                            profile={data.me}
                                        />
                                        <ProfileSection>
                                            <ProfileSectionHeader title="Membership" />
                                            <div className="profile-section-line">
                                                <ProfileItem title="Member ID" content={`#${data.me.id}`} />
                                                <ProfileItem title="Quarter" content="1" />
                                            </div>
                                            <div className="profile-section-line">
                                                <ProfileItem
                                                    title="Starting day"
                                                    content={format(data.me.createdAt, 'D MMMM YYYY')}
                                                />
                                                <ProfileItem
                                                    title="Next renewal"
                                                    content={format('2019/03/05', 'D MMMM YYYY')}
                                                />
                                            </div>
                                        </ProfileSection>
                                        <ProfileSection>
                                            <ProfileSectionHeader
                                                title="Personal info"
                                                edit
                                                editName="personalInfo"
                                                editTitle="info"
                                                onEditClick={this.onOpenModal}
                                            />
                                            <div className="profile-section-line">
                                                <ProfileItem title="First Name" content={data.me.firstName} />
                                                <ProfileItem title="Last name" content={data.me.lastName} />
                                            </div>
                                            <div className="profile-section-line">
                                                <ProfileItem
                                                    title="Birthday"
                                                    content={
                                                        data.me.birthday ? format(data.me.birthday, 'D MMMM YYYY') : ''
                                                    }
                                                />
                                            </div>
                                            <div className="profile-section-line">
                                                <ProfileItem title="Email" content={data.me.email} />
                                                <ProfileItem title="Phone number" content={data.me.phone} />
                                            </div>
                                        </ProfileSection>
                                    </LayoutProfile>
                                );
                            }
                        }}
                    </Query>
                </Layout>
            </TrackedPage>
        );
    }

    private onOpenModal = (evt: any) => {
        this.setState({
            modalOpenName: evt.currentTarget.dataset.name,
        });
    };

    private onCloseModal = () => {
        this.setState({ modalOpenName: undefined });
    };
}

export default withAuth(ProfileMain);
