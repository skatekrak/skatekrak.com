import Router, { withRouter } from 'next/router';
import React from 'react';
import { connect } from 'react-redux';

import Link from 'components/Link';
import ForgotPassword from 'components/pages/club/authentication/forgotPassword';
import Login from 'components/pages/club/authentication/login';
import ResetPassword from 'components/pages/club/authentication/resetPassword';

import IconArrow from 'components/Ui/Icons/Arrow';

import ScrollHelper from 'lib/ScrollHelper';
import { State as SettingState } from 'store/reducers/setting';

type Props = {
    view: string;
    router: any;
    setting: SettingState;
};

type State = {};

class ClubAuth extends React.PureComponent<Props, State> {
    public componentDidMount() {
        const scrollContainer = ScrollHelper.getScrollContainer();
        scrollContainer.classList.add('blur-bg');
        Router.events.on('routeChangeStart', this.handleChangeRoute);
    }

    public componentDidUpdate(prevProps) {
        if (prevProps.setting.isMobile !== this.props.setting.isMobile) {
            const scrollContainer = ScrollHelper.getScrollContainer();
            scrollContainer.classList.add('blur-bg');
        }
    }

    public componentWillUnmount() {
        Router.events.off('routeChangeStart', this.handleChangeRoute);
    }

    public render() {
        return (
            <>
                <div className="auth-container container-fluid">
                    {this.props.view === 'login' ? (
                        <button onClick={Router.back} className="auth-back">
                            <IconArrow />
                            Back
                        </button>
                    ) : (
                        <Link href="/club?modal=login" as="/club/login">
                            <a className="auth-back">
                                <IconArrow />
                                Back to login
                            </a>
                        </Link>
                    )}
                    {this.props.view === 'login' && <Login />}
                    {this.props.view === 'forgot' && <ForgotPassword />}
                    {this.props.view === 'reset' && <ResetPassword />}
                </div>
            </>
        );
    }

    private handleChangeRoute = (url) => {
        if (url === '/club') {
            const scrollContainer = ScrollHelper.getScrollContainer();
            scrollContainer.classList.remove('blur-bg');
        }
    };
}

export default withRouter(connect((state: any) => ({ setting: state.setting }))(ClubAuth));
