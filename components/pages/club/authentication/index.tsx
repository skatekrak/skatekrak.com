import Router, { withRouter } from 'next/router';
import React from 'react';

import Link from 'components/Link';
import ForgotPassword from 'components/pages/club/authentication/forgotPassword';
import Login from 'components/pages/club/authentication/login';
import ResetPassword from 'components/pages/club/authentication/resetPassword';

import IconArrow from 'components/Ui/Icons/Arrow';

type Props = {
    view: string;
    router: any;
};

type State = {};

class ClubAuth extends React.PureComponent<Props, State> {
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
}

export default withRouter(ClubAuth);
