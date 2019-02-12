import React from 'react';

import Field from 'components/Ui/Form/Field';

const Address: React.SFC = () => (
    <React.Fragment>
        <div className="form-double-field-line">
            <Field name="First name" placeholder="First name" />
            <Field name="Last name" placeholder="Last name" />
        </div>
        <Field name="Address" placeholder="Address" />
        <Field name="Apt/unit etc (optional)" placeholder="Apt/unit etc (optional)" />
        <div className="form-double-field-line">
            <Field name="City" placeholder="City" />
            <Field name="Postal code" placeholder="Postal code" />
        </div>
        <Field name="State" placeholder="State" />
        <Field name="Country" placeholder="Country" />
    </React.Fragment>
);

export default Address;
