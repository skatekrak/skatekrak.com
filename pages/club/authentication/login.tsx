import React from 'react';

import BackgroundLoader from 'components/Ui/Utils/BackgroundLoader';

type Props = {};

type State = {};

class Login extends React.PureComponent<Props, State> {
    public render() {
        return (
            <div>
                <form>
                    <button type="submit" onClick={this.handleSubmit}>
                        Log in
                    </button>
                </form>
            </div>
        );
    }

    private handleSubmit = (evt: any) => {
        evt.preventDefault();
    };
}

export default Login;
