import { NextPage } from 'next';
import React from 'react';
import { compose } from 'recompose';

import Layout from 'components/Layout/Layout';
import AuthQuery from 'components/pages/club/profile/AuthQuery';
import LayoutProfile from 'components/pages/club/profile/LayoutProfile';
import TrackedPage from 'components/pages/TrackedPage';
import ErrorMessage from 'components/Ui/Form/ErrorMessage';

import ProfilePreferencesSection from 'components/pages/club/profile/Ui/ProfilePreferencesSection';

import withAuth from 'hocs/withAuth';

import { GET_ME } from 'pages/club/profile';
import { withApollo } from 'react-apollo';

const ProfilePreference: NextPage = () => (
    <TrackedPage name="Club/Profile/Preference">
        <Layout>
            <AuthQuery query={GET_ME}>
                {({ data }) => {
                    if (data && data.me) {
                        return (
                            <LayoutProfile profile={data.me} view="preference">
                                <ProfilePreferencesSection member={data.me} />
                            </LayoutProfile>
                        );
                    } else {
                        return <ErrorMessage message="Oh, weird" />;
                    }
                }}
            </AuthQuery>
        </Layout>
    </TrackedPage>
);

export default compose(
    withAuth,
    withApollo,
)(ProfilePreference);
