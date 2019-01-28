import React from 'react';

import Layout from 'components/Layout/Layout';
import LayoutProfile from 'components/pages/club/profile/LayoutProfile';

const profile = {
    firstName: 'Guillaume',
    lastName: 'Lefebvre',
    location: {
        city: 'Biarritz',
        countryCode: 'fr',
    },
    memberId: '75',
};

type Props = {};

class ProfilePayment extends React.Component<Props, {}> {
    public render() {
        return (
            <Layout>
                <LayoutProfile profile={profile} view="payment">
                    <div id="profile-content">Payment</div>
                </LayoutProfile>
            </Layout>
        );
    }
}

export default ProfilePayment;
