import { FORM_ERROR, FormApi } from 'final-form';
import gql from 'graphql-tag';
import React from 'react';
import { Form } from 'react-final-form';

import ProfileEditModal from 'components/pages/club/profile/Ui/editModal';

import ErrorMessage from 'components/Ui/Form/ErrorMessage';
import Field from 'components/Ui/Form/Field';
import Select from 'components/Ui/Form/Select';

import { GET_ME } from 'pages/club/profile';

import withApollo, { WithApolloProps } from 'hocs/withApollo';

type Props = {
    memberId: string;
    address?: any;
    open: boolean;
    onClose: () => void;
};

const GET_COUNTRIES = gql`
    query {
        countriesByCurrency {
            isoCode
            name
        }
    }
`;

class ProfileEditAddressModal extends React.Component<Props & WithApolloProps> {
    public render() {
        let formattedInitialValues: any = {};
        if (this.props.address) {
            formattedInitialValues = {
                ...this.props.address,
                country: {
                    label: this.props.address.country.name,
                    value: this.props.address.country.isoCode,
                },
            };
        }

        return (
            <ProfileEditModal
                modalTitle={this.props.address ? 'Edit address' : 'Add address'}
                open={this.props.open}
                onClose={this.props.onClose}
            >
                <Form onSubmit={this.handleSubmit} validate={validateForm} initialValues={formattedInitialValues}>
                    {({ handleSubmit, submitting, submitError }) => (
                        <form className="profile-modal-form" onSubmit={handleSubmit}>
                            <ErrorMessage message={submitError} />
                            <Field name="title" label="Address title" />
                            <div className="form-double-field-line">
                                <Field name="firstName" label="First name" />
                                <Field name="lastName" label="Last name" />
                            </div>
                            <Field name="line1" label="Street" />
                            <div className="form-double-field-line">
                                <Field name="line2" label="Apt, room... (optional)" />
                                <Field name="city" label="City" />
                            </div>
                            <div className="form-double-field-line">
                                <Field name="postalCode" label="Postal code" />
                                <Field name="state" label="State (optional)" />
                            </div>
                            <Select
                                name="country"
                                label="Country"
                                disabled={this.props.address !== undefined}
                                loadOptions={this.queryCountries}
                            />
                            <button className="button-primary profile-modal-form-submit" disabled={submitting}>
                                Save
                            </button>
                        </form>
                    )}
                </Form>
            </ProfileEditModal>
        );
    }

    private handleSubmit = async (values: any, formApi: FormApi) => {
        const fields = formApi.getRegisteredFields();
        // We get the modified values
        const dirtyValues = {};
        for (const key of fields) {
            if (formApi.getFieldState(key).dirty) {
                dirtyValues[key] = values[key];
            }
        }

        try {
            const variables: any = {
                address: dirtyValues,
            };

            if (this.props.address) {
                variables.id = this.props.address.id;
            } else {
                variables.memberId = this.props.memberId;
                variables.address.country = variables.address.country.value;
            }

            await this.props.apolloClient.mutate({
                mutation: this.props.address ? UPDATE_ADDRESS : ADD_ADDRESS,
                variables,
                update: (cache, result) => {
                    const query = cache.readQuery<any>({
                        query: GET_ME,
                    });
                    const data = result.data as any;

                    if (query && data) {
                        if (this.props.address) {
                            // We update the address in the current list
                            query.me.addresses.map((address) => {
                                if (address.id === this.props.address.id) {
                                    return data.updateAddress;
                                }
                            });
                        } else {
                            query.me.addresses.push(data.addAddress);
                        }

                        cache.writeQuery({
                            query: GET_ME,
                            data: {
                                me: query.me,
                            },
                        });
                    }

                    this.props.onClose();
                },
            });
        } catch (error) {
            if (error.graphQLErrors) {
                if (!(error.graphQLErrors instanceof Array)) {
                    return { [FORM_ERROR]: error.graphQLErrors };
                }
                return error.graphQLErrors[0].state;
            }
            return { [FORM_ERROR]: `We could not ${this.props.address ? 'update' : 'add'} this` };
        }
    };

    private queryCountries = (_inputValue: string, callback: (options: {}[]) => void) => {
        this.props.apolloClient
            .query<any>({
                query: GET_COUNTRIES,
            })
            .then((result) => {
                const options = result.data.countriesByCurrency.map((country) => ({
                    label: country.name,
                    value: country.isoCode,
                }));

                callback(options);
            });
    };
}

const validateForm = (values: any) => {
    const errors: any = {};

    if (!values.title) {
        errors.title = 'Required';
    }

    if (!values.firstName) {
        errors.firstName = 'Required';
    }

    if (!values.lastName) {
        errors.lastName = 'Required';
    }

    if (!values.line1) {
        errors.line1 = 'Required';
    }

    if (!values.city) {
        errors.city = 'Required';
    }

    if (!values.postalCode) {
        errors.postalCode = 'Required';
    }

    if (!values.country) {
        errors.country = 'Required';
    }

    return errors;
};

const UPDATE_ADDRESS = gql`
    mutation updateAddress($id: ID!, $address: AddressUpdateInput) {
        updateAddress(id: $id, address: $address) {
            id
            title
            firstName
            lastName
            line1
            line2
            city
            postalCode
            country {
                isoCode
                name
            }
            state
            default
        }
    }
`;

const ADD_ADDRESS = gql`
    mutation addAddress($memberId: ID!, $address: AddressCreateInput) {
        addAddress(memberId: $memberId, address: $address) {
            id
            title
            firstName
            lastName
            line1
            line2
            city
            postalCode
            country {
                name
                isoCode
            }
            state
            default
        }
    }
`;

export default withApollo(ProfileEditAddressModal);
