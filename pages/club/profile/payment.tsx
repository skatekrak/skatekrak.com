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

import { GET_ME } from 'pages/club/profile';

type State = {
    modalOpenName?: 'creditCardInfo' | 'billingAddressInfo';
    stripe?: any;
};

class ProfilePayment extends React.Component<{}, State> {
    public state: State = {
        modalOpenName: undefined,
        stripe: null,
    };

    public componentDidMount() {
        this.setState({
            stripe: (window as any).Stripe(process.env.STRIPE_KEY),
        });
    }

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
                                    <StripeProvider stripe={this.state.stripe}>
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
                                                    <AddressPreview address={data.me.paymentCard.billingAddress} />
                                                </div>
                                            </ProfileSection>
                                            <ProfileSection>
                                                <ProfileSectionHeader title="History" />
                                                {data.me.paymentHistory.map((payment) => (
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
