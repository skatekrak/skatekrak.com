import React from 'react';

import Field from 'components/Ui/Form/Field';

type Props = {
    quarterFull: boolean;
    onNextClick: () => void;
};

type State = {};

class CreateAccount extends React.Component<Props, State> {
    public state: State = {};

    public render() {
        const { quarterFull, onNextClick } = this.props;
        return (
            <form id="subscribe-container" className="subscribe-form" onSubmit={this.handleSubmit}>
                <div id="subscribe-first-container">
                    {!quarterFull ? (
                        <div id="subscribe-status">The club is not full you can subscribe for 87€</div>
                    ) : (
                        <div id="subscribe-status">Aie, the club is full</div>
                    )}
                </div>
                <div id="subscribe-second-container" className="subscribe-item-container">
                    <h1 className="subscribe-title">
                        Create your
                        <br />
                        member account
                    </h1>
                    <div className="subscribe-content">
                        <p className="subscribe-content-description">
                            Join the squad
                            <br />
                            and take part of the adventure.
                        </p>
                        <div className="form-double-field-line">
                            <Field name="firstName" placeholder="First name" />
                            <Field name="lastName" placeholder="Last name" />
                        </div>
                        <Field name="email" placeholder="Email" />
                        <Field name="password" placeholder="Password" />
                    </div>
                    <button onClick={onNextClick} className="button-primary subscribe-form-submit">
                        {!quarterFull ? 'Become a Kraken' : 'Pre-pay'}
                    </button>
                </div>
            </form>
        );
    }

    private handleSubmit = (evt: any) => {
        evt.preventDefault();
    };
}

export default CreateAccount;
