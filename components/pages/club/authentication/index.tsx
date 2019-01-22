import React from 'react';
import { connect } from 'react-redux';

import { State as SettingState } from 'store/reducers/setting';

import ForgotPassword from 'components/pages/club/authentication/forgotPassword';
import Login from 'components/pages/club/authentication/login';
import ResetPassword from 'components/pages/club/authentication/resetPassword';

import IconArrow from 'components/Ui/Icons/Arrow';
import IconCross from 'components/Ui/Icons/Cross';

interface Props {
    setting: SettingState;
    view: string;
}

type State = {};

class ClubAuth extends React.PureComponent<Props, State> {
    public render() {
        return (
            <>
                <div className="auth-container container-fluid">
                    {this.props.setting.isMobile ? (
                        <span className="auth-back">
                            <IconArrow />
                            Back
                        </span>
                    ) : (
                        <span className="auth-close">
                            <IconCross />
                        </span>
                    )}
                    {this.props.view === 'login' && <Login />}
                    {this.props.view === 'forgot' && <ForgotPassword />}
                    {this.props.view === 'reset' && <ResetPassword />}
                </div>
            </>
        );
    }
}

export default connect((state: any) => ({ setting: state.setting }))(ClubAuth);
