import validator from 'email-validator';
import { FORM_ERROR } from 'final-form';
import gql from 'graphql-tag';
import React from 'react';
import { ChildProps, graphql } from 'react-apollo';
import { Form } from 'react-final-form';

import ProfileEditModal from 'components/pages/club/profile/Ui/editModal';

import DatePicker from 'components/Ui/Form/DatePicker';
import ErrorMessage from 'components/Ui/Form/ErrorMessage';
import Field from 'components/Ui/Form/Field';

import { GET_ME } from 'pages/club/profile/index';

type Props = {
    profile: any;
    open: boolean;
    onClose: () => void;
};

class ProfileEditInfoModal extends React.Component<Props & ChildProps> {
    public render() {
        return (
            <ProfileEditModal modalTitle="Edit personal infos" open={this.props.open} onClose={this.props.onClose}>
                <Form onSubmit={this.handleSubmit} validate={validateForm} initialValues={this.props.profile}>
                    {({ handleSubmit, submitting, submitError }) => (
                        <form className="profile-modal-form" onSubmit={handleSubmit}>
                            <ErrorMessage message={submitError} />
                            <div className="form-double-field-line">
                                <Field name="firstName" label="First name" />
                                <Field name="lastName" label="Last name" />
                            </div>
                            <Field name="email" label="Email" />
                            <div className="form-double-field-line">
                                <Field name="phone" label="Phone number" />
                                <DatePicker name="birthday" label="Birthday" />
                            </div>
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
        const { mutate } = this.props;
        if (mutate) {
            try {
                await mutate({
                    variables: {
                        id: this.props.profile.id,
                        data: {
                            email: this.props.profile.email !== values.email ? values.email : undefined,
                            firstName: values.firstName,
                            lastName: values.lastName,
                            phone: values.phone,
                            birthday: values.birthday || undefined,
                        },
                    },
                    update: (cache, result) => {
                        const query = cache.readQuery<any>({
                            query: GET_ME,
                        });

                        const data = result.data as any;
                        if (query && data) {
                            cache.writeQuery({
                                query: GET_ME,
                                data: {
                                    me: {
                                        ...query.me,
                                        ...data.updateMember,
                                    },
                                },
                            });
                        }
                    },
                });

                this.props.onClose();
            } catch (error) {
                if (error.graphQLErrors) {
                    if (!(error.graphQLErrors instanceof Array)) {
                        return { [FORM_ERROR]: error.graphQLErrors };
                    }
                    return error.graphQLErrors[0].state;
                }
                return { [FORM_ERROR]: 'We could not update your profile' };
            }
        }
    };
}

const validateForm = (values: any) => {
    const errors: any = {};

    if (!values.firstName) {
        errors.firstName = 'Required';
    }

    if (!values.lastName) {
        errors.lastname = 'Required';
    }

    if (!values.email) {
        errors.email = 'Required';
    } else if (!validator.validate(values.email)) {
        errors.email = 'This email address is not valid';
    }

    return errors;
};

const UPDATE_MEMBER = gql`
    mutation updateMember($id: ID!, $data: UpdateMemberInput) {
        updateMember(id: $id, data: $data) {
            firstName
            lastName
            email
            phone
            birthday
        }
    }
`;

export default graphql<Props>(UPDATE_MEMBER)(ProfileEditInfoModal);
