import React from 'react';
import { Query } from 'react-apollo';

import Layout from 'components/Layout/Layout';
import LayoutProfile from 'components/pages/club/profile/LayoutProfile';
import Loading from 'components/pages/news/Articles/Loading';
import TrackedPage from 'components/pages/TrackedPage';
import ErrorMessage from 'components/Ui/Form/ErrorMessage';

import ProfilePreferencesSection from 'components/pages/club/profile/Ui/ProfilePreferencesSection';

import withAuth from 'hocs/withAuth';

import { GET_ME } from 'pages/club/profile';

class ProfilePreference extends React.Component {
    public render() {
        return (
            <TrackedPage name="Club/Profile/Preference">
                <Layout>
                    <Query query={GET_ME}>
                        {({ loading, error, data }) => {
                            if (loading) {
                                return <Loading />;
                            }

                            if (error) {
                                return <pre>{JSON.stringify(error, undefined, 2)}</pre>;
                            }

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
                    </Query>
                </Layout>
            </TrackedPage>
        );
    }
}

export default withAuth(ProfilePreference);
