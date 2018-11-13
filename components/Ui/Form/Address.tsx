import * as React from 'react';

import RenderInput from 'components/Ui/Form/Input';
import RenderSelect from 'components/Ui/Form/Select';
import { Field } from 'redux-form';

type Props = {
    countries: {
        value: string;
        label: string;
    }[];
};

const Element: React.SFC<Props> = ({ countries }: Props) => (
    <React.Fragment>
        <Field label="First name" name="firstName" component={RenderInput} type="text" />
        <Field label="Last name" name="lastName" component={RenderInput} type="text" />
        <Field label="Address" name="line1" component={RenderInput} type="text" />
        <Field label="Apt/unit etc (optional)" name="line2" component={RenderInput} type="text" />
        <Field label="City" name="city" component={RenderInput} type="text" />
        <Field label="Postal code" name="postalcode" component={RenderInput} type="text" />
        <Field label="Country" name="country" component={RenderSelect} options={countries} />
    </React.Fragment>
);

export default Element;
