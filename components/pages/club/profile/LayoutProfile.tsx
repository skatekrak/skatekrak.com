import React from 'react';

import ProfileNav from 'components/pages/club/profile/nav';

import 'static/styles/profile.styl';
import OnboardingModal from '../onboarding/onboardingModal';

type Props = {
    profile: any;
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
        {profile && !profile.onBoarding ? <OnboardingModal profile={profile} /> : <></>}
    </div>
);

export default LayoutProfile;
