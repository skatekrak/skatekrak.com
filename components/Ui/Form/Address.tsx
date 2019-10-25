import React from 'react';

import Field from 'components/Ui/Form/Field';
import Select from 'components/Ui/Form/Select';

import countries from 'lib/countries';
import createPropsGetter from 'lib/getProps';

type Props = {
    namePrefix?: string;
} & Partial<DefaultProps>;

type DefaultProps = Readonly<typeof defaultProps>;

const defaultProps = {
    allCountries: true,
};

const getProps = createPropsGetter(defaultProps);

const shippingCountries = [
    {
        isoCode: 'fr',
        name: 'France',
    },
    {
        isoCode: 'gb',
        name: 'United Kingdom',
    },
    {
        isoCode: 'be',
        name: 'Belgium',
    },
    {
        isoCode: 'pt',
        name: 'Portgual',
    },
    {
        isoCode: 'de',
        name: 'Deutschland',
    },
    {
        isoCode: 'nl',
        name: 'Nederland',
    },
    {
        isoCode: 'us',
        name: 'United States',
    },
];

const Address = (props: Props) => {
    const { namePrefix, allCountries } = getProps(props);

    const queriedCountries = shippingCountries.map(country => ({
        label: country.name,
        value: country.isoCode,
    }));

    return (
        <>
            <div className="form-double-field-line">
                <Field name={getName('firstname', namePrefix)} placeholder="First name" />
                <Field name={getName('lastname', namePrefix)} placeholder="Last name" />
            </div>
            <Field name={getName('line1', namePrefix)} placeholder="Street" />
            <Field name={getName('line2', namePrefix)} placeholder="Apt/unit etc (optional)" />
            <div className="form-double-field-line">
                <Field name={getName('city', namePrefix)} placeholder="City" />
                <Field name={getName('postalCode', namePrefix)} placeholder="Postal code" />
            </div>
            <Field name={getName('state', namePrefix)} placeholder="State" />
            <Select
                name={getName('country', namePrefix)}
                placeholder="Country"
                options={allCountries ? formatCountries(countries) : queriedCountries}
                menuMaxHeight={200}
                isSearchable
            />
        </>
    );
};

const getName = (name: string, prefix?: string): string => {
    if (prefix) {
        return `${prefix}.${name}`;
    }
    return name;
};

const formatCountries = (cntrs: typeof countries): { label: string; value: string }[] => {
    const options: { label: string; value: string }[] = [];
    for (const key of Object.keys(cntrs)) {
        options.push({
            label: cntrs[key],
            value: key.toLowerCase(),
        });
    }
    return options;
};

export default Address;
