import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import getConfig from 'next/config';
import React from 'react';
import { Elements, StripeProvider } from 'react-stripe-elements';

import Layout from 'components/Layout/Layout';
import AuthQuery from 'components/pages/club/profile/AuthQuery';
import LayoutProfile from 'components/pages/club/profile/LayoutProfile';
import BillingAddress from 'components/pages/club/profile/Ui/BillingAddress';
import ProfileItem from 'components/pages/club/profile/Ui/item';
import ProfileEditBillingAddressModal from 'components/pages/club/profile/Ui/modals/ProfileEditBillingAddressModal';
import ProfileEditCreditCardModal from 'components/pages/club/profile/Ui/modals/ProfileEditCreditCardModal';
import PaymentLine from 'components/pages/club/profile/Ui/PaymentLine';
import ProfileSection from 'components/pages/club/profile/Ui/section';
import ProfileSectionHeader from 'components/pages/club/profile/Ui/sectionHeader';
import TrackedPage from 'components/pages/TrackedPage';
import Emoji from 'components/Ui/Icons/Emoji';

import { GET_ME } from 'pages/club/profile';

import { withApollo } from 'hocs/withApollo';

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
            stripe: (window as any).Stripe(getConfig().publicRuntimeConfig.STRIPE_KEY),
        });
    }

    public render() {
        return (
            <TrackedPage name="Club/Profile/Shipment">
                <Layout>
                    <AuthQuery query={GET_ME}>
                        {({ data }) => {
                            if (data && data.me) {
                                return (
                                    <StripeProvider stripe={this.state.stripe}>
                                        <LayoutProfile profile={data.me} view="payment">
                                            {data.me.paymentCard && (
                                                <ProfileEditBillingAddressModal
                                                    open={this.state.modalOpenName === 'billingAddressInfo'}
                                                    onClose={this.onCloseModal}
                                                    memberId={data.me.id}
                                                    address={data.me.paymentCard.billingAddress}
                                                />
                                            )}
                                            <Elements>
                                                <ProfileEditCreditCardModal
                                                    open={this.state.modalOpenName === 'creditCardInfo'}
                                                    onClose={this.onCloseModal}
                                                    profile={data.me}
                                                />
                                            </Elements>
                                            {data.me.paymentCard && (
                                                <>
                                                    <ProfileSection>
                                                        <ProfileSectionHeader
                                                            title="Membership"
                                                            edit
                                                            editName="creditCardInfo"
                                                            editTitle="credit card"
                                                            onEditClick={this.onOpenModal}
                                                        />
                                                        <div className="profile-section-line">
                                                            <div className="profile-section-desc">
                                                                <p>
                                                                    For any doubt & question here - never forget the
                                                                    best way to reach us [and talk to{' '}
                                                                    {getConfig().publicRuntimeConfig.CLUB_CONTACT_NAME};
                                                                    he's a very nice dude]: send an email to{' '}
                                                                    <a
                                                                        className="text-primary"
                                                                        href="mailto:club@skatekrak.com"
                                                                    >
                                                                        club@skatekrak.com
                                                                    </a>
                                                                </p>
                                                                <p>
                                                                    You're part of something special & this is truly an
                                                                    'adventure-in-progress' - that being said we plan to
                                                                    put here a 'cancel / pause my membership' option -
                                                                    meanwhile, you know how it works: send us an email{' '}
                                                                    <Emoji symbol="😉" label="winking face" />
                                                                </p>
                                                                <p>
                                                                    You rock{' '}
                                                                    <Emoji symbol="🤘" label="sign of the horns" />
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="profile-section-line">
                                                            <ProfileItem
                                                                title="Next renewal"
                                                                content={
                                                                    data.me.renewAt
                                                                        ? format(
                                                                              parseISO(data.me.renewAt),
                                                                              'd MMMM yyyy',
                                                                          )
                                                                        : 'Never'
                                                                }
                                                            />
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
                                                            <BillingAddress
                                                                address={data.me.paymentCard.billingAddress}
                                                            />
                                                        </div>
                                                    </ProfileSection>
                                                </>
                                            )}
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
                    </AuthQuery>
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

export default withApollo(ProfilePayment);
