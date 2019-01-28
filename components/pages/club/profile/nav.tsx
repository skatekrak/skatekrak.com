import classNames from 'classnames';
import React from 'react';

import Link from 'components/Link';
import ArrowHead from 'components/Ui/Icons/ArrowHead';

type Props = {
    profile: object;
    view: string;
};

type State = {
    isMainNavOpen: boolean;
};

class ProfileNav extends React.Component<Props, State> {
    public state: State = {
        isMainNavOpen: false,
    };
    public render() {
        const { profile, view } = this.props;
        const { isMainNavOpen } = this.state;
        return (
            <nav id="profile-nav-container">
                <header id="profile-nav-header">
                    <h1 id="profile-nav-header-title">
                        {profile.firstName} {profile.lastName}
                    </h1>
                    <span id="profile-nav-header-location">
                        {profile.location.city}
                        {', '}
                        <span className="text-cap">{profile.location.countryCode}</span>
                    </span>
                    <div id="profile-nav-header-memberid-container">
                        <p id="profile-nav-header-memberid-title">Member ID</p>
                        <p id="profile-nav-header-memberid">#{profile.memberId}</p>
                    </div>
                </header>
                <ul
                    className={classNames('profile-nav-main', {
                        'profile-nav-main--open': isMainNavOpen,
                    })}
                >
                    <li>
                        <Link href="/club/profile">
                            <a
                                className={classNames('profile-nav-main-item', {
                                    'profile-nav-main-item--active': view === 'profile',
                                })}
                                onClick={this.handleMainNavOpen}
                            >
                                Profile
                                <ArrowHead />
                            </a>
                        </Link>
                    </li>
                    <li>
                        <Link href="/club/profile/preference">
                            <a
                                className={classNames('profile-nav-main-item', {
                                    'profile-nav-main-item--active': view === 'preference',
                                })}
                                onClick={this.handleMainNavOpen}
                            >
                                Preference
                                <ArrowHead />
                            </a>
                        </Link>
                    </li>
                    <li>
                        <Link href="/club/profile/shipment">
                            <a
                                className={classNames('profile-nav-main-item', {
                                    'profile-nav-main-item--active': view === 'shipment',
                                })}
                                onClick={this.handleMainNavOpen}
                            >
                                Shipment
                                <ArrowHead />
                            </a>
                        </Link>
                    </li>
                    <li>
                        <Link href="/club/profile/payment">
                            <a
                                className={classNames('profile-nav-main-item', {
                                    'profile-nav-main-item--active': view === 'payment',
                                })}
                                onClick={this.handleMainNavOpen}
                            >
                                Payment
                                <ArrowHead />
                            </a>
                        </Link>
                    </li>
                </ul>
                <ul className="profile-nav-secondary">
                    <li className="profile-nav-secondary-item">
                        <button>Chat with us</button>
                    </li>
                    <li className="profile-nav-secondary-item">
                        <Link href="/club/profile">
                            <a>Terms & privacy</a>
                        </Link>
                    </li>
                    <li className="profile-nav-secondary-item">
                        <button>Log out</button>
                    </li>
                </ul>
            </nav>
        );
    }

    private handleMainNavOpen = () => {
        this.setState({ isMainNavOpen: !this.state.isMainNavOpen });
    };
}

export default ProfileNav;
