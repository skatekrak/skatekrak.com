import React from 'react';

import Field from 'components/Ui/Form/Field';
import Emoji from 'components/Ui/Icons/Emoji';

type Props = {
    onNextClick: () => void;
};

type State = {};

class Preference extends React.Component<Props, State> {
    public state: State = {};

    public render() {
        const { onNextClick } = this.props;
        return (
            <form
                className="onboarding onboarding-preference modal-two-col-container modal-two-col-form"
                onSubmit={this.handleSubmit}
            >
                <div className="modal-two-col-first-container modal-two-col-item-container">
                    <h1 className="modal-two-col-title">Preference</h1>
                    <div className="modal-two-col-content">
                        <p className="modal-two-col-content-description">
                            Better to get the right sizes before shipping anything. Tell us what you wear / ride.
                            <br />
                            As far as you know <Emoji symbol="🤷‍♂️" label="I dont know" />
                        </p>
                        <div className="form-double-field-line">
                            <Field name="tshirtSize" label="T-shirt size" />
                            <Field name="shoeSize" label="Shoe size" />
                        </div>
                        <div className="form-double-field-line">
                            <Field name="boxerSize" label="Boxer size" />
                            <Field name="jeanSize" label="Jean size" />
                        </div>
                    </div>
                </div>
                <div className="modal-two-col-second-container modal-two-col-item-container">
                    <div className="modal-two-col-content">
                        <Field name="brokenDeck" label="How many decks do you break / year on average?" />
                        <div className="form-double-field-line">
                            <Field name="deckSize" label="Deck size" />
                            <Field name="wheelsize" label="Wheel size" />
                        </div>
                        <div className="form-double-field-line">
                            <Field name="truckSize" label="Truck size" />
                            <Field name="truckHeight" label="Truck height" />
                        </div>
                    </div>
                    <button onClick={onNextClick} className="button-primary modal-two-col-form-submit">
                        Finish
                    </button>
                </div>
            </form>
        );
    }

    private handleSubmit = (evt: any) => {
        evt.preventDefault();
    };
}

export default Preference;
