import React from 'react';

import RenderInput from 'components/Ui/Form/Input';
import RenderSelect from 'components/Ui/Form/Select';
import { Field } from 'redux-form';

const countriesOptions = [
    {
        value: 'pt',
        label: 'Portugal',
    },
    {
        value: 'fr',
        label: 'France',
    },
    {
        value: 'es',
        label: 'Spain',
    },
    {
        value: 'us',
        label: 'United States',
    },
    {
        value: 'at',
        label: 'Austria',
    },
    {
        value: 'be',
        label: 'Belgium',
    },
    {
        value: 'ch',
        label: 'Switzerland',
    },
    {
        value: 'de',
        label: 'Germany',
    },
    {
        value: 'gb',
        label: 'United Kingdom',
    },
    {
        value: 'ie',
        label: 'Ireland',
    },
    {
        value: 'it',
        label: 'Italy',
    },
    {
        value: 'lu',
        label: 'Luxembourg',
    },
    {
        value: 'nl',
        label: 'Netherlands',
    },
];

type Props = {
    prefix?: string;
};

const Address: React.SFC<Props> = ({ prefix }: Props) => (
    <React.Fragment>
        <Field label="First name" name={getName('firstName', prefix)} component={RenderInput} type="text" />
        <Field label="Last name" name={getName('lastName', prefix)} component={RenderInput} type="text" />
        <Field label="Address" name={getName('line1', prefix)} component={RenderInput} type="text" />
        <Field label="Apt/unit etc (optional)" name={getName('line2', prefix)} component={RenderInput} type="text" />
        <Field label="City" name={getName('city', prefix)} component={RenderInput} type="text" />
        <Field label="Postal code" name={getName('postalcode', prefix)} component={RenderInput} type="text" />
        <Field label="State" name={getName('state', prefix)} component={RenderInput} type="text" />
        <Field label="Country" name={getName('country', prefix)} component={RenderSelect} options={countriesOptions} />
    </React.Fragment>
);

const getName = (name: string, prefix?: string): string => {
    if (prefix) {
        return `${prefix}.${name}`;
    }
    return name;
};

export default Address;
