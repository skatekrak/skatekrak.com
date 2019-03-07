import gql from 'graphql-tag';
import React from 'react';
import { Query } from 'react-apollo';
import { compose } from 'recompose';

import Layout from 'components/Layout/Layout';
import LayoutProfile from 'components/pages/club/profile/LayoutProfile';
import AddressSection from 'components/pages/club/profile/Shipments/AddressSection';
import ProfileEditAddressModal from 'components/pages/club/profile/Ui/modals/ProfileEditAddressModal';
import ProfileSection from 'components/pages/club/profile/Ui/section';
import TrackedPage from 'components/pages/TrackedPage';
import IconCross from 'components/Ui/Icons/Cross';
import IconFull from 'components/Ui/Icons/iconFull';
import { KrakLoading } from 'components/Ui/Icons/Spinners';
import { showConfirmation } from 'components/Ui/Modal/ModalConfirmation';

import withApollo, { WithApolloProps } from 'hocs/withApollo';
import withAuth from 'hocs/withAuth';

import { GET_ME } from 'pages/club/profile';

type State = {
    addressModalOpen: boolean;
    editingAddress?: any;
    deleteModalOpen: boolean;
};
// tslint:disable:jsx-no-lambda
class ProfileShipment extends React.Component<WithApolloProps, State> {
    public state: State = {
        addressModalOpen: false,
        deleteModalOpen: false,
    };

    public render() {
        return (
            <TrackedPage name="Club/Profile/Shipment">
                <Layout>
                    <Query query={GET_ME}>
                        {({ loading, error, data }) => {
                            if (loading) {
                                return <KrakLoading />;
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
                                            <AddressSection
                                                key={address.id}
                                                address={address}
                                                onEdit={this.openModal}
                                                onDelete={this.onDeleteClick}
                                                setAsDefault={this.setAsDefault}
                                            />
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

    private onDeleteClick = (address: any) => {
        showConfirmation({
            title: 'Wait!',
            message: 'Are you sure you want to delete this address?',
            buttons: [
                {
                    label: 'Cancel',
                },
                {
                    label: 'Delete address',
                    onClick: () => this.deleteAddress(address),
                },
            ],
        });
    };

    private onCloseDeleteModal = () => {
        this.setState({ deleteModalOpen: false });
    };

    private deleteAddress = async ({ id }: any) => {
        await this.props.apolloClient.mutate({
            mutation: DELETE_ADDRESS,
            variables: { id },
            update: (cache, result) => {
                const query = cache.readQuery<any>({
                    query: GET_ME,
                });
                const data = result.data as any;

                if (query && data) {
                    query.me.addresses = query.me.addresses.filter((address) => address.id !== data.deleteAddress.id);

                    cache.writeQuery({
                        query: GET_ME,
                        data: {
                            me: query.me,
                        },
                    });
                }
            },
        });
        this.onCloseDeleteModal();
    };

    private setAsDefault = async ({ id }: any) => {
        await this.props.apolloClient.mutate({
            mutation: SET_AS_DEFAULT,
            variables: { id },
            update: (cache, result) => {
                const query = cache.readQuery<any>({
                    query: GET_ME,
                });
                const data = result.data as any;

                if (query && data) {
                    query.me.addresses = query.me.addresses.map((address) => {
                        if (address.id === data.setDefaultAddress.id) {
                            return {
                                ...address,
                                default: true,
                            };
                        } else {
                            return {
                                ...address,
                                default: false,
                            };
                        }
                    });

                    cache.writeQuery({
                        query: GET_ME,
                        data: {
                            me: query.me,
                        },
                    });
                }
            },
        });
    };
}

const SET_AS_DEFAULT = gql`
    mutation setDefaultAddress($id: ID!) {
        setDefaultAddress(id: $id) {
            id
        }
    }
`;

const DELETE_ADDRESS = gql`
    mutation deleteAddress($id: ID!) {
        deleteAddress(id: $id) {
            id
        }
    }
`;

export default compose(
    withApollo,
    withAuth,
)(ProfileShipment);
