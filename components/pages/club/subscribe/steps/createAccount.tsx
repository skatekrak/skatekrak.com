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
                    <article id="subscribe-promote">
                        <header id="subscribe-promote-header">
                            <p id="subscribe-promote-header-join">Join the club</p>
                            <h2 id="subscribe-promote-header-title">Krak Skate Club</h2>
                            <h3 id="subscribe-promote-header-subtitle">- Quarterly membership -</h3>
                        </header>
                        <main id="subscribe-promote-main">
                            <p id="subscribe-promote-main-price">99€ today</p>
                            {!quarterFull ? (
                                <>
                                    <p id="subscribe-promote-main-cover">to be covered until April 4th 2019</p>
                                </>
                            ) : (
                                <>
                                    <p id="subscribe-promote-main-cover">to guarantee your slot for the next quarter</p>
                                    <p id="subscribe-promote-main-cover">from April 5th to July 4th 2019</p>
                                </>
                            )}
                        </main>
                        <footer id="subscribe-promote-footer">
                            {!quarterFull ? (
                                <>
                                    <p id="subscribe-promote-footer-subscription">Subscription close on February 28</p>
                                    <p id="subscribe-promote-footer-remaining">
                                        12 places remaining for the next quarter
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p id="subscribe-promote-footer-subscription">Subscribe for the next quarter</p>
                                    <p id="subscribe-promote-footer-remaining">
                                        The club is actually full for this quarter.
                                        <br />
                                        Pre-pay to be onboard on the next one!
                                    </p>
                                </>
                            )}
                        </footer>
                    </article>
                </div>
                <div id="subscribe-second-container" className="subscribe-item-container">
                    <h1 className="subscribe-title">
                        Create your account.
                        <br />
                        Become a Kraken.
                    </h1>
                    <div className="subscribe-content">
                        <p className="subscribe-content-description">Take part of the adventure.</p>
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
