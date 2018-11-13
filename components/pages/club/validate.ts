import validator from 'email-validator';

export default function(values) {
    const errors: any = {};

    if (!values.email) {
        errors.email = 'Required';
    } else if (!validator.validate(values.email)) {
        errors.email = 'Email not valid';
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

    if (!values.postalcode) {
        errors.postalcode = 'Required';
    }

    if (!values.country) {
        errors.country = 'Required';
    }

    return errors;
}
