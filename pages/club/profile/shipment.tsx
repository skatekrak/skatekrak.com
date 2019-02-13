import React from 'react';
import { Query } from 'react-apollo';

import Layout from 'components/Layout/Layout';
import LayoutProfile from 'components/pages/club/profile/LayoutProfile';
import AddressNav from 'components/pages/club/profile/Ui/AddressNav';
import AddressPreview from 'components/pages/club/profile/Ui/addressPreview';
import ProfileEditAddressModal from 'components/pages/club/profile/Ui/modals/ProfileEditAddressModal';
import ProfileSection from 'components/pages/club/profile/Ui/section';
import ProfileSectionHeader from 'components/pages/club/profile/Ui/sectionHeader';
import Loading from 'components/pages/news/Articles/Loading';
import TrackedPage from 'components/pages/TrackedPage';
import IconCross from 'components/Ui/Icons/Cross';
import IconFull from 'components/Ui/Icons/iconFull';

import withAuth from 'hocs/withAuth';

import { GET_ME } from 'pages/club/profile';

type State = {
    addressModalOpen: boolean;
    editingAddress?: any;
};
// tslint:disable:jsx-no-lambda
class ProfileShipment extends React.Component<{}, State> {
    public state: State = {
        addressModalOpen: false,
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
                                    <LayoutProfile profile={data.me} view="shipment">
                                        <ProfileEditAddressModal
                                            memberId={data.me.id}
                                            address={this.state.editingAddress}
                                            open={this.state.addressModalOpen}
                                            onClose={this.onClose}
                                        />
                                        <ProfileSection>
                                            <div className="profile-section-line">
                                                <button
                                                    className="profile-address-add"
                                                    onClick={() => this.openModal()}
                                                >
                                                    <IconFull icon={<IconCross />} />
                                                    Add new address
                                                </button>
                                            </div>
                                        </ProfileSection>
                                        {data.me.addresses.map((address) => (
                                            <ProfileSection key={address.id}>
                                                <ProfileSectionHeader
                                                    edit
                                                    editTitle={address.title}
                                                    onEditClick={() => this.openModal(address)}
                                                >
                                                    <AddressNav address={address} onDeleteClick={null} />
                                                </ProfileSectionHeader>
                                                <div className="profile-section-line">
                                                    <AddressPreview address={address} />
                                                </div>
                                            </ProfileSection>
                                        ))}
                                    </LayoutProfile>
                                );
                            }
                        }}
                    </Query>
                </Layout>
            </TrackedPage>
        );
    }
    // tslint:enable:jsx-no-lambda

    private openModal = (address: any = undefined) => {
        this.setState({
            addressModalOpen: true,
            editingAddress: address,
        });
    };

    private onClose = () => {
        this.setState({ addressModalOpen: false, editingAddress: undefined });
    };
}

export default ProfileShipment;
