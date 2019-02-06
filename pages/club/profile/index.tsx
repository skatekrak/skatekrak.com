import React from 'react';

import Layout from 'components/Layout/Layout';
import LayoutProfile from 'components/pages/club/profile/LayoutProfile';
import ProfileEditModal from 'components/pages/club/profile/Ui/editModal';
import ProfileItem from 'components/pages/club/profile/Ui/item';
import ProfileSection from 'components/pages/club/profile/Ui/section';
import ProfileSectionHeader from 'components/pages/club/profile/Ui/sectionHeader';
import TrackedPage from 'components/pages/TrackedPage';

import 'static/styles/form.styl';

const profile = {
    firstName: 'Guillaume',
    lastName: 'Lefebvre',
    birthday: '25 march 1992',
    email: 'guillaume.lefebvre@gmail.com',
    phoneNumber: '0659061248',
    social: {
        instagram: '@guillaumeDgomme',
    },
    preference: {
        wearable: {
            tshirtSize: 'Medium (M)',
            shoeSize: '43',
            boxershortSize: 'Large (L)',
        },
        skateboarding: {
            brokenDeck: '5',
            deckSize: '8.125"',
            truckSize: '149mm',
            truckHeight: 'High',
            wheelSize: '55mm',
        },
    },
    shipping: {
        address1: {
            acutal: true,
            firstName: 'Guillaume',
            lastName: 'Lefebvre',
            street: '24 allée daguilera',
            apt: 'apt 2',
            city: 'Anglet',
            cityCode: '64600',
            state: 'Pyrénées-atlantique',
            country: 'France',
            countryCode: 'fr',
        },
        address2: {
            acutal: false,
            firstName: 'Arnaud',
            lastName: 'Molinos',
            street: '27 bis avenue de larochefoucauld',
            apt: 'apt 3',
            city: 'Biarritz',
            cityCode: '64200',
            state: 'Pyrénées-atlantique',
            country: 'France',
            countryCode: 'fr',
        },
    },
    payment: {
        membership: {
            memberId: '75',
            start: '23 january 2019',
            next: '5 march 2019',
            renew: true,
            creditCard: '**** **** **** 6462',
        },
        billingAddress: {
            firstName: 'Guillaume',
            lastName: 'Lefebvre',
            street: '24 allée daguilera',
            apt: 'apt 2',
            city: 'Anglet',
            cityCode: '64600',
            state: 'Pyrénées-atlantique',
            country: 'France',
            countryCode: 'fr',
        },
        history: [
            {
                desc: 'Quarter membership to Krak skate club x1',
                date: '5 march 2019',
                price: '87€',
                invoiceLink: '',
            },
            {
                desc: 'Quarter membership to Krak skate club x1',
                date: '5 june 2019',
                price: '87€',
                invoiceLink: '',
            },
        ],
    },
};

type Props = {};

type State = {
    modalOpenName: string;
    isEditPersonalOpen: boolean;
    isEditSocialOpen: boolean;
};

class ProfileMain extends React.Component<Props, State> {
    public state: State = {
        modalOpenName: '',
        isEditPersonalOpen: false,
        isEditSocialOpen: false,
    };
    public render() {
        return (
            <TrackedPage name="Club/Profile">
                <ProfileEditModal
                    modalTitle="Edit personal infos"
                    open={this.state.isEditPersonalOpen}
                    onClose={this.onCloseModal}
                >
                    <form className="profile-modal-form">
                        <div className="form-element">
                            <div className="form-element-label">First name</div>
                            <div className="form-element-field">
                                <input type="text" placeholder="Guillaume" />
                            </div>
                        </div>
                        <button className="button-primary profile-modal-form-submit">Save</button>
                    </form>
                </ProfileEditModal>
                <Layout>
                    <LayoutProfile profile={profile} view="profile">
                        <ProfileSection>
                            <ProfileSectionHeader title="Membership" />
                            <div className="profile-section-line">
                                <ProfileItem title="Member ID" content={`#${profile.payment.membership.memberId}`} />
                                <ProfileItem title="Quarter" content="1" />
                            </div>
                            <div className="profile-section-line">
                                <ProfileItem title="Starting day" content={profile.payment.membership.start} />
                                <ProfileItem title="Next renewal" content={profile.payment.membership.next} />
                            </div>
                        </ProfileSection>
                        <ProfileSection>
                            <ProfileSectionHeader
                                title="Personal info"
                                edit
                                editName="Personal"
                                editTitle="info"
                                onEditClick={this.onOpenModal}
                            />
                            <div className="profile-section-line">
                                <ProfileItem title="First Name" content={profile.firstName} />
                                <ProfileItem title="Last name" content={profile.lastName} />
                            </div>
                            <div className="profile-section-line">
                                <ProfileItem title="Birthday" content={profile.birthday} />
                            </div>
                            <div className="profile-section-line">
                                <ProfileItem title="Email" content={profile.email} />
                                <ProfileItem title="Phone number" content={profile.phoneNumber} />
                            </div>
                        </ProfileSection>
                        <ProfileSection>
                            <ProfileSectionHeader title="Social" edit editTitle="social" onEditClick={null} />
                            <div className="profile-section-line">
                                <ProfileItem title="Instagram" content={profile.social.instagram} />
                            </div>
                        </ProfileSection>
                    </LayoutProfile>
                </Layout>
            </TrackedPage>
        );
    }

    private onOpenModal = (evt: any) => {
        const stateKey = `isEdit${evt.currentTarget.dataset.name}Open`;
        const newState = {
            modalOpenName: evt.currentTarget.dataset.name,
            [stateKey]: true,
        };
        this.setState(newState);
    };

    private onCloseModal = () => {
        const stateKey = `isEdit${this.state.modalOpenName}Open`;
        const newState = {
            [stateKey]: false,
        };
        this.setState(newState);
    };
}

export default ProfileMain;
