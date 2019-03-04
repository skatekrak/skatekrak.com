import classNames from 'classnames';
import React from 'react';

import Link from 'components/Link';
import ArrowHead from 'components/Ui/Icons/ArrowHead';
import Emoji from 'components/Ui/Icons/Emoji';

type Props = {
    profile: any;
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
                        Hey <Emoji symbol="👋" label="hand shake" /> {profile.firstName}
                    </h1>
                </header>
                <ul
                    className={classNames('profile-nav-main', {
                        'profile-nav-main--open': isMainNavOpen,
                    })}
                >
                    <li
                        className={classNames('profile-nav-main-item', {
                            'profile-nav-main-item--active': view === 'profile',
                        })}
                    >
                        <Link prefetch href="/club/profile">
                            <a className="profile-nav-main-item-link" onClick={this.handleMainNavOpen}>
                                Profile
                                <ArrowHead />
                            </a>
                        </Link>
                    </li>
                    <li
                        className={classNames('profile-nav-main-item', {
                            'profile-nav-main-item--active': view === 'preference',
                        })}
                    >
                        <Link prefetch href="/club/profile/preference">
                            <a className="profile-nav-main-item-link" onClick={this.handleMainNavOpen}>
                                Preference
                                <ArrowHead />
                            </a>
                        </Link>
                    </li>
                    <li
                        className={classNames('profile-nav-main-item', {
                            'profile-nav-main-item--active': view === 'shipment',
                        })}
                    >
                        <Link prefetch href="/club/profile/shipment">
                            <a className="profile-nav-main-item-link" onClick={this.handleMainNavOpen}>
                                Shipment
                                <ArrowHead />
                            </a>
                        </Link>
                    </li>
                    <li
                        className={classNames('profile-nav-main-item', {
                            'profile-nav-main-item--active': view === 'payment',
                        })}
                    >
                        <Link prefetch href="/club/profile/payment">
                            <a className="profile-nav-main-item-link" onClick={this.handleMainNavOpen}>
                                Payment
                                <ArrowHead />
                            </a>
                        </Link>
                    </li>
                </ul>
                {/* <ul className="profile-nav-secondary">
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
                </ul> */}
            </nav>
        );
    }

    private handleMainNavOpen = () => {
        this.setState({ isMainNavOpen: !this.state.isMainNavOpen });
    };
}

export default ProfileNav;
