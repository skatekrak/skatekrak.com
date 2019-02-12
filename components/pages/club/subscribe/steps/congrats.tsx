import React from 'react';

import Emoji from 'components/Ui/Icons/Emoji';

type Props = {
    onNextClick: () => void;
};

const Congrats: React.SFC<Props> = ({ onNextClick }) => (
    <div id="subscribe-container">
        <div id="subscribe-first-container" className="subscribe-item-container">
            <div id="subscribe-congrats-first-container">
                <img id="subscribe-congrats-first-img" src="/static/images/step_3_2x.png" alt="Welcome kraken" />
                <p id="subscribe-congrats-first-title">
                    <Emoji symbol="💥" label="bang" />
                    Bang
                    <Emoji symbol="💥" label="bang" />
                </p>
                <p id="subscribe-congrats-first-text">You're a Kraken now!</p>
            </div>
            <div id="subscribe-container-separator" />
        </div>
        <div id="subscribe-second-container" className="subscribe-item-container">
            <h1 className="subscribe-title">
                Welcome
                <br />
                to the family
            </h1>
            <div className="subscribe-content">
                <p className="subscribe-content-description">
                    Welcome message that is a bit long but not to long. Glad to have you intofamilly. Lorem ipsum dolor
                    sit amet, consectetur
                </p>
            </div>
            <button onClick={onNextClick} className="button-primary subscribe-form-submit">
                Start onboarding
            </button>
        </div>
    </div>
);

export default Congrats;
