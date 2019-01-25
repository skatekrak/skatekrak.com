import React from 'react';

import ProfileNav from 'components/pages/club/profile/nav';

const profile = {
    firstName: 'Guillaume',
    lastName: 'Lefebvre',
    location: {
        city: 'Biarritz',
        countryCode: 'fr',
    },
    memberId: '75',
};

type Props = {
    children: any;
};

const LayoutProfile: React.SFC<Props> = ({ children }) => (
    <div id="profile-container" className="container-fluid inner-page-container">
        <div className="row">
            <ProfileNav profile={profile} />
            <div id="profile-content-container" className="col-xs-12 col-md-9">
                {children}
            </div>
        </div>
    </div>
);

export default LayoutProfile;
