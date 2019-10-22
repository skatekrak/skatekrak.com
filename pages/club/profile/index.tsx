import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import gql from 'graphql-tag';
import React from 'react';
import { compose } from 'recompose';

import Layout from 'components/Layout/Layout';
import AuthQuery from 'components/pages/club/profile/AuthQuery';
import LayoutProfile from 'components/pages/club/profile/LayoutProfile';
import ProfileItem from 'components/pages/club/profile/Ui/item';
import ProfileEditInfoModal from 'components/pages/club/profile/Ui/modals/ProfileEditInfoModal';
import ProfileSection from 'components/pages/club/profile/Ui/section';
import ProfileSectionHeader from 'components/pages/club/profile/Ui/sectionHeader';
import TrackedPage from 'components/pages/TrackedPage';
import Emoji from 'components/Ui/Icons/Emoji';

import { withApollo } from 'hocs/withApollo';
import withAuth from 'hocs/withAuth';

import '/public/styles/form.styl';

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
            renewAt
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
            onboarding
            paymentHistory
            paymentCard
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
                    <AuthQuery query={GET_ME}>
                        {({ data }) => (
                            <LayoutProfile profile={data.me} view="profile">
                                <ProfileEditInfoModal
                                    open={this.state.modalOpenName === 'personalInfo'}
                                    onClose={this.onCloseModal}
                                    profile={data.me}
                                />
                                <div id="profile-main-welcome">
                                    <h1 id="profile-main-welcome-title">
                                        Hey <Emoji symbol="👋" label="hand shake" /> {data.me.firstName}
                                    </h1>
                                    <p id="profile-main-welcome-message">
                                        Welcome to your profile. Here we’re able to know more about you. The one & only
                                        reason: we wanna provide the best experience possible. Remember it’s all about
                                        fun <Emoji symbol="😜" label="Winking face with tongue" />
                                    </p>
                                </div>
                                <ProfileSection>
                                    <ProfileSectionHeader title="Membership" />
                                    {/* <div className="profile-section-line">
                                        <ProfileItem title="Member ID" content={`#${data.me.id}`} />
                                        <ProfileItem title="Quarter" content="First quarter" />
                                    </div> */}
                                    <div className="profile-section-line">
                                        <ProfileItem
                                            title="Starting day"
                                            content={format(parseISO(data.me.createdAt), 'd MMMM YYYY')}
                                        />
                                        <ProfileItem
                                            title="Next renewal"
                                            content={
                                                data.me.renewAt
                                                    ? format(parseISO(data.me.renewAt), 'd MMMM yyyy')
                                                    : 'Never'
                                            }
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
                                        <ProfileItem title="Birthday" content={data.me.birthday} />
                                    </div>
                                    <div className="profile-section-line">
                                        <ProfileItem title="Email" content={data.me.email} />
                                        <ProfileItem title="Phone number" content={data.me.phone} />
                                    </div>
                                </ProfileSection>
                            </LayoutProfile>
                        )}
                    </AuthQuery>
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

export default compose(
    withAuth,
    withApollo,
)(ProfileMain);
