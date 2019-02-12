import React from 'react';
import { Query } from 'react-apollo';
import { Elements, StripeProvider } from 'react-stripe-elements';

import Layout from 'components/Layout/Layout';
import LayoutProfile from 'components/pages/club/profile/LayoutProfile';
import AddressPreview from 'components/pages/club/profile/Ui/addressPreview';
import ProfileItem from 'components/pages/club/profile/Ui/item';
import ProfileEditBillingAddressModal from 'components/pages/club/profile/Ui/modals/ProfileEditBillingAddressModal';
import ProfileEditCreditCardModal from 'components/pages/club/profile/Ui/modals/ProfileEditCreditCardModal';
import PaymentLine from 'components/pages/club/profile/Ui/PaymentLine';
import ProfileSection from 'components/pages/club/profile/Ui/section';
import ProfileSectionHeader from 'components/pages/club/profile/Ui/sectionHeader';
import Loading from 'components/pages/news/Articles/Loading';
import TrackedPage from 'components/pages/TrackedPage';

// const profile = {
//   firstName: 'Guillaume',
//   lastName: 'Lefebvre',
//   birthday: '25 march 1992',
//   email: 'guillaume.lefebvre@gmail.com',
//   phoneNumber: '0659061248',
//   social: {
//     instagram: '@guillaumeDgomme',
//   },
//   preference: {
//     wearable: {
//       tshirtSize: 'Medium (M)',
//       shoeSize: '43',
//       boxershortSize: 'Large (L)',
//     },
//     skateboarding: {
//       brokenDeck: '5',
//       deckSize: '8.125"',
//       truckSize: '149mm',
//       truckHeight: 'High',
//       wheelSize: '55mm',
//     },
//   },
//   shipping: {
//     address1: {
//       actual: true,
//       firstName: 'Guillaume',
//       lastName: 'Lefebvre',
//       street: '24 allée daguilera',
//       apt: 'apt 2',
//       city: 'Anglet',
//       cityCode: '64600',
//       state: 'Pyrénées-atlantique',
//       country: 'France',
//       countryCode: 'fr',
//     },
//     address2: {
//       actual: false,
//       firstName: 'Arnaud',
//       lastName: 'Molinos',
//       street: '27 bis avenue de larochefoucauld',
//       apt: 'apt 3',
//       city: 'Biarritz',
//       cityCode: '64200',
//       state: 'Pyrénées-atlantique',
//       country: 'France',
//       countryCode: 'fr',
//     },
//   },
//   payment: {
//     membership: {
//       memberId: '75',
//       start: '23 january 2019',
//       next: '',
//       renew: true,
//       creditCard: '**** **** **** 6462',
//     },
//     billingAddress: {
//       firstName: 'Guillaume',
//       lastName: 'Lefebvre',
//       street: '24 allée daguilera',
//       apt: 'apt 2',
//       city: 'Anglet',
//       cityCode: '64600',
//       state: 'Pyrénées-atlantique',
//       country: 'France',
//       countryCode: 'fr',
//     },
//     history: [
//       {
//         id: '1',
//         desc: 'Quarter membership to Krak skate club x1',
//         date: '5 march 2019',
//         price: '87€',
//         invoiceLink: '',
//       },
//       {
//         id: '2',
//         desc: 'Quarter membership to Krak skate club x1',
//         date: '5 june 2019',
//         price: '87€',
//         invoiceLink: '',
//       },
//     ],
//   },
// };

import { GET_ME } from 'pages/club/profile';

type Props = {};

type State = {
    modalOpenName?: 'creditCardInfo' | 'billingAddressInfo';
};

class ProfilePayment extends React.Component<Props, State> {
    public state: State = {
        modalOpenName: undefined,
    };

    public render() {
        return (
            <TrackedPage name="Club/Profile/Shipment">
                <Layout>
                    <Query query={GET_ME}>
                        {({ loading, error, data }) => {
                            if (loading) {
                                return <Loading />;
                            }

                            if (error) {
                                return <pre>{JSON.stringify(error, undefined, 2)}</pre>;
                            }

                            if (data && data.me) {
                                return (
                                    <StripeProvider apiKey="pk_test_a7PsGhkcvou7utv5OHO4kdqr">
                                        <LayoutProfile profile={data.me} view="payment">
                                            <ProfileEditBillingAddressModal
                                                open={this.state.modalOpenName === 'billingAddressInfo'}
                                                onClose={this.onCloseModal}
                                                memberId={data.me.id}
                                                address={data.me.paymentCard.billingAddress}
                                            />
                                            <Elements>
                                                <ProfileEditCreditCardModal
                                                    open={this.state.modalOpenName === 'creditCardInfo'}
                                                    onClose={this.onCloseModal}
                                                    profile={data.me}
                                                />
                                            </Elements>
                                            <ProfileSection>
                                                <ProfileSectionHeader
                                                    title="Membership"
                                                    edit
                                                    editName="creditCardInfo"
                                                    editTitle="credit card"
                                                    onEditClick={this.onOpenModal}
                                                />
                                                <div className="profile-section-line">
                                                    <ProfileItem title="Next renewal" content={'5 march 2019'} />
                                                </div>
                                                <div className="profile-section-line">
                                                    <ProfileItem
                                                        title="Credit card"
                                                        content={'**** **** **** ' + data.me.paymentCard.last4}
                                                    />
                                                </div>
                                            </ProfileSection>
                                            <ProfileSection>
                                                <ProfileSectionHeader
                                                    title="Billing address"
                                                    edit
                                                    editName="billingAddressInfo"
                                                    editTitle="billing address"
                                                    onEditClick={this.onOpenModal}
                                                />
                                                <div className="profile-section-line">
                                                    <AddressPreview
                                                        name={data.me.paymentCard.name}
                                                        address={data.me.paymentCard.billingAddress}
                                                    />
                                                </div>
                                            </ProfileSection>
                                            <ProfileSection>
                                                <ProfileSectionHeader title="History" />
                                                {data.me.paymentHistory.map(payment => (
                                                    <PaymentLine key={payment.id} payment={payment} />
                                                ))}
                                            </ProfileSection>
                                        </LayoutProfile>
                                    </StripeProvider>
                                );
                            }
                        }}
                    </Query>
                </Layout>
            </TrackedPage>
        );
    }

    private onOpenModal = (evt: any) => {
        this.setState({
            modalOpenName: evt.currentTarget.dataset.name,
        });
    };

    private onCloseModal = () => {
        this.setState({ modalOpenName: undefined });
    };
}

export default ProfilePayment;
