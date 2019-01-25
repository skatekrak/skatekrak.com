import React from 'react';

import Link from 'components/Link';

type Props = {
    profile: object;
};

const ProfileNav: React.SFC<Props> = ({ profile }) => (
    <div id="profile-nav-container" className="col-xs-12 col-md-3">
        <header id="profile-nav-header">
            <h1 id="profile-nav-header-title">
                {profile.firstName}
                {''}
                {profile.lastName}
            </h1>
            <span id="profile-nav-header-location">
                {profile.location.city}
                {', '}
                <span className="text-cap">{profile.location.cityCode}</span>
            </span>
            <div id="profile-nav-header-mermberid-container">
                <p id="profile-nav-header-mermberid-title">Member ID</p>
                <p id="profile-nav-header-mermberid">#{profile.memberId}</p>
            </div>
        </header>
        <nav id="profile-nav-container">
            <ul id="profile-nav">
                <li className="profile-nav-item">Profile</li>
                <li className="profile-nav-item">Preference</li>
                <li className="profile-nav-item">Shipment</li>
                <li className="profile-nav-item">Payment</li>
            </ul>
            <ul id="profile-nav-secondary">
                <li className="profile-nav-secodnray-item">Chat with us</li>
                <li className="profile-nav-secodnray-item">Terms & privacy</li>
                <li className="profile-nav-secodnray-item">Log out</li>
            </ul>
        </nav>
    </div>
);

export default ProfileNav;
