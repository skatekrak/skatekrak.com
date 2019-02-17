import React from 'react';

import Emoji from 'components/Ui/Icons/Emoji';

type Props = {
    quarterFull: boolean;
};

const Congrats = ({ quarterFull }: Props) => (
    <div className="subscribe modal-two-col-container modal-two-col-form">
        <div className="modal-two-col-first-container modal-two-col-item-container">
            <div id="subscribe-congrats-first-container">
                <img id="subscribe-congrats-first-img" src="/static/images/step_3_2x.png" alt="Welcome kraken" />
                <p id="subscribe-congrats-first-title">
                    <Emoji symbol="💥" label="bang" />
                    Bang
                    <Emoji symbol="💥" label="bang" />
                </p>
                {!quarterFull ? (
                    <p id="subscribe-congrats-first-text">You're a Kraken now!</p>
                ) : (
                    <p id="subscribe-congrats-first-text">You’ll be a kraken soon</p>
                )}
            </div>
            <div className="modal-two-col-container-separator" />
        </div>
        <div className="modal-two-col-second-container modal-two-col-item-container">
            <h1 className="modal-two-col-title">
                Welcome in
                <br />
                the Krak family
            </h1>
            <div className="modal-two-col-content">
                <p className="modal-two-col-content-description">
                    We’re devoted to one mission: making the world a huge playground. That starts here and now. We’re
                    psyched to count on your support and be sure of one thing: we’ll have fun. We started skateboarding
                    more than 15 years ago and our passion only grew ever since. Never hesitate to contact us if you’d
                    have any question. Peace <Emoji symbol="✌" label="peace" />
                </p>
            </div>
            <button className="button-primary modal-two-col-form-submit">Join the Ride</button>
        </div>
    </div>
);

export default Congrats;
