import gql from 'graphql-tag';
import React from 'react';
import { ChildProps, graphql } from 'react-apollo';
import { CardCVCElement, CardExpiryElement, CardNumberElement, injectStripe } from 'react-stripe-elements';

import ProfileEditModal from 'components/pages/club/profile/Ui/editModal';
import { GET_ME } from 'pages/club/profile';

type Props = {
    profile: any;
    open: boolean;
    onClose: () => void;
    stripe?: any;
};

class ProfileEditCreditCardModal extends React.Component<Props & ChildProps> {
    public render() {
        return (
            <ProfileEditModal modalTitle="Edit credit card" open={this.props.open} onClose={this.props.onClose}>
                <CardNumberElement />
                <CardExpiryElement />
                <CardCVCElement />
                <button className="button-primary profile-modal-form-submit" onClick={this.handleSubmit}>
                    Save
                </button>
            </ProfileEditModal>
        );
    }

    private handleSubmit = async () => {
        const { mutate, profile, stripe, onClose } = this.props;
        if (mutate && stripe) {
            const token = (await stripe.createToken()).token;
            await mutate({
                variables: {
                    memberId: profile.id,
                    token: token.id,
                },
                update: (cache, result) => {
                    const query = cache.readQuery<any>({ query: GET_ME });
                    const data = result.data as any;
                    if (query && data) {
                        const card = data.updateCard;
                        cache.writeQuery({
                            query: GET_ME,
                            data: {
                                me: {
                                    ...query.me,
                                    paymentCard: {
                                        id: card.id,
                                        brand: card.brand,
                                        country: card.country,
                                        expYear: card.exp_year,
                                        expMonth: card.exp_month,
                                        last4: card.last4,
                                        cvcCheck: card.cvc_check,
                                        billingAddress: {
                                            name: card.name,
                                            city: card.address_city,
                                            country: card.address_country,
                                            line1: card.address_line1,
                                            line2: card.address_line2,
                                            state: card.address_state,
                                            zip: card.address_zip,
                                        },
                                    },
                                },
                            },
                        });
                    }
                    onClose();
                },
            });
        } else {
            console.log("Stripe.js hasn't loaded yet.");
        }
    };
}

const UPDATE_CREDIT_CARD = gql`
    mutation updateCard($memberId: ID!, $token: String!) {
        updateCard(memberId: $memberId, token: $token)
    }
`;

export default graphql<Props>(UPDATE_CREDIT_CARD)(injectStripe(ProfileEditCreditCardModal));
