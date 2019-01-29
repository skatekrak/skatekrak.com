import React from 'react';

import ProfileNav from 'components/pages/club/profile/nav';

import 'static/styles/profile.styl';

type Props = {
    profile: object;
    children: any;
    view: string;
};

const LayoutProfile: React.SFC<Props> = ({ profile, children, view }) => (
    <div id="profile-container" className="container-fluid inner-page-container">
        <div className="row">
            <div className="col-xs-12 col-md-3">
                <ProfileNav profile={profile} view={view} />
            </div>
            <div className="col-xs-12 col-md-9">{children}</div>
        </div>
    </div>
);

export default LayoutProfile;
