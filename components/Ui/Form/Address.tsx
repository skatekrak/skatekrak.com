import React from 'react';
import { Field } from 'react-final-form';

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
        value: 'us',
        label: 'United States',
    },
    {
        value: 'be',
        label: 'Belgium',
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
        value: 'nl',
        label: 'Netherlands',
    },
];

type Props = {
    prefix?: string;
};

const Address: React.SFC<Props> = ({ prefix }: Props) => (
    <React.Fragment>
        <Field label="First name" name={getName('firstName', prefix)} type="text" />
        <Field label="Last name" name={getName('lastName', prefix)} type="text" />
        <Field label="Address" name={getName('line1', prefix)} type="text" />
        <Field label="Apt/unit etc (optional)" name={getName('line2', prefix)} type="text" />
        <Field label="City" name={getName('city', prefix)} type="text" />
        <Field label="Postal code" name={getName('postalcode', prefix)} type="text" />
        <Field label="State" name={getName('state', prefix)} type="text" />
        <Field label="Country" name={getName('country', prefix)} options={countriesOptions} />
    </React.Fragment>
);

const getName = (name: string, prefix?: string): string => {
    if (prefix) {
        return `${prefix}.${name}`;
    }
    return name;
};

export default Address;
