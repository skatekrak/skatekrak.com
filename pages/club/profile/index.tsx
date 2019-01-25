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

class ProfileMain extends React.Component<Props, {}> {
    public render() {
        const { children } = this.props;
        return (
            <Layout>
                <LayoutProfile>Memebership</LayoutProfile>
            </Layout>
        );
    }
}

export default ProfileMain;
