import React from 'react';

import OnboardingModal from 'components/pages/club/onboarding/onboardingModal';
import ProfileNav from 'components/pages/club/profile/nav';

import 'static/styles/profile.styl';

type Props = {
    profile: any;
    children: any;
    view: string;
};

const LayoutProfile: React.SFC<Props> = ({ profile, children, view }) => (
    <div id="profile-container" className="container-fluid inner-page-container">
        <div className="row">
            <div className="col-xs-12 col-md-4 col-lg-3">
                <ProfileNav profile={profile} view={view} />
            </div>
            <div className="col-xs-12 col-md-8 col-lg-9">{children}</div>
        </div>
        {!profile.onboarding && <OnboardingModal profile={profile} />}
    </div>
);

export default LayoutProfile;
