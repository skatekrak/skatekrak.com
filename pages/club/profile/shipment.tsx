import React from 'react';

import Layout from 'components/Layout/Layout';
import LayoutProfile from 'components/pages/club/profile/LayoutProfile';
import AddressNav from 'components/pages/club/profile/Ui/AddressNav';
import AddressPreview from 'components/pages/club/profile/Ui/addressPreview';
import ProfileSection from 'components/pages/club/profile/Ui/section';
import ProfileSectionHeader from 'components/pages/club/profile/Ui/sectionHeader';
import TrackedPage from 'components/pages/TrackedPage';
import IconCross from 'components/Ui/Icons/Cross';
import IconFull from 'components/Ui/Icons/iconFull';

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
            actual: true,
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
            actual: false,
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
                id: '1',
                desc: 'Quarter membership to Krak skate club x1',
                date: '5 march 2019',
                price: '87€',
                invoiceLink: '',
            },
            {
                id: '2',
                desc: 'Quarter membership to Krak skate club x1',
                date: '5 june 2019',
                price: '87€',
                invoiceLink: '',
            },
        ],
    },
};

type Props = {};

class ProfileShipment extends React.Component<Props, {}> {
    public render() {
        return (
            <TrackedPage name="Club/Profile/Shipment">
                <Layout>
                    <LayoutProfile profile={profile} view="shipment">
                        <ProfileSection>
                            <div className="profile-section-line">
                                <button className="profile-address-add">
                                    <IconFull icon={<IconCross />} />
                                    Add new address
                                </button>
                            </div>
                        </ProfileSection>
                        <ProfileSection>
                            <ProfileSectionHeader edit editTitle="Address 1" onEditClick={null}>
                                <AddressNav address={profile.shipping.address1} onDeleteClick={null} />
                            </ProfileSectionHeader>
                            <div className="profile-section-line">
                                <AddressPreview address={profile.shipping.address1} />
                            </div>
                        </ProfileSection>
                        <ProfileSection>
                            <ProfileSectionHeader edit editTitle="Address 2" onEditClick={null}>
                                <AddressNav address={profile.shipping.address2} onDeleteClick={null} />
                            </ProfileSectionHeader>
                            <div className="profile-section-line">
                                <AddressPreview address={profile.shipping.address2} />
                            </div>
                        </ProfileSection>
                    </LayoutProfile>
                </Layout>
            </TrackedPage>
        );
    }
}

export default ProfileShipment;
