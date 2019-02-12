import { FORM_ERROR } from 'final-form';
import gql from 'graphql-tag';
import React from 'react';
import { ChildProps, graphql } from 'react-apollo';
import { Form } from 'react-final-form';

import ProfileEditModal from 'components/pages/club/profile/Ui/editModal';
import ErrorMessage from 'components/Ui/Form/ErrorMessage';
import Field from 'components/Ui/Form/Field';

import { GET_ME } from 'pages/club/profile';

type Props = {
    memberId: string;
    address: any;
    open: boolean;
    onClose: () => void;
};

class ProfileEditBillingAddressModal extends React.Component<Props & ChildProps> {
    public render() {
        return (
            <ProfileEditModal modalTitle="Edit billing address" open={this.props.open} onClose={this.props.onClose}>
                <Form onSubmit={this.handleSubmit} validate={validateForm} initialValues={this.props.address}>
                    {({ handleSubmit, submitting, submitError }) => (
                        <form className="profile-modal-form" onSubmit={handleSubmit}>
                            <ErrorMessage message={submitError} />
                            <Field name="name" label="Name" />
                            <Field name="line1" label="Street" />
                            <Field name="line2" label="Apartment number, floor number, etc." />
                            <Field name="zip" label="Postal code" />
                            <Field name="city" label="City" />
                            <Field name="state" label="State" />
                            <Field name="country" label="Country" />
                            <button className="button-primary profile-modal-form-submit" disabled={submitting}>
                                Save
                            </button>
                        </form>
                    )}
                </Form>
            </ProfileEditModal>
        );
    }

    private handleSubmit = async (values: any) => {
        const { mutate, memberId, onClose } = this.props;
        if (mutate) {
            try {
                await mutate({
                    variables: {
                        memberId,
                        data: {
                            name: values.name,
                            line1: values.line1,
                            line2: values.line2,
                            zip: values.zip,
                            city: values.city,
                            state: values.state,
                            country: values.country,
                        },
                    },
                    update: (cache, result) => {
                        const query = cache.readQuery<any>({ query: GET_ME });
                        const data = result.data as any;
                        if (query && data) {
                            const card = data.updateBillingAddress;
                            cache.writeQuery({
                                query: GET_ME,
                                data: {
                                    me: {
                                        ...query.me,
                                        paymentCard: {
                                            ...query.me.paymentCard,
                                            billingAddress: {
                                                name: card.name,
                                                line1: card.address_line1,
                                                line2: card.address_line2,
                                                zip: card.address_zip,
                                                city: card.address_city,
                                                state: card.address_state,
                                                country: card.address_country,
                                            },
                                        },
                                    },
                                },
                            });
                        }
                    },
                });

                onClose();
            } catch (error) {
                if (error.graphQLErrors) {
                    if (!(error.graphQLErrors instanceof Array)) {
                        return { [FORM_ERROR]: error.graphQLErrors };
                    }
                    return error.graphQLErrors[0].state;
                }
                return { [FORM_ERROR]: 'We could not update your billing address' };
            }
        }
    };
}

const validateForm = (values: any) => {
    const errors: any = {};

    if (!values.name) {
        errors.name = 'Required';
    }

    if (!values.line1) {
        errors.line1 = 'Required';
    }

    if (!values.zip) {
        errors.zip = 'Required';
    }

    if (!values.city) {
        errors.city = 'Required';
    }

    if (!values.country) {
        errors.country = 'Required';
    }

    return errors;
};

const UPDATE_BILLING_ADDRESS = gql`
    mutation updateBillingAddress($memberId: ID!, $data: UpdateBillingAddressInput) {
        updateBillingAddress(memberId: $memberId, data: $data)
    }
`;

export default graphql<Props>(UPDATE_BILLING_ADDRESS)(ProfileEditBillingAddressModal);
