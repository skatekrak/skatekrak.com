import gql from 'graphql-tag';
import React from 'react';

import withApollo, { WithApolloProps } from 'hocs/withApollo';

import Field from 'components/Ui/Form/Field';
import Select from 'components/Ui/Form/Select';

import countries from 'lib/countries';
import createPropsGetter from 'lib/getProps';

const GET_COUNTRIES = gql`
    query {
        countries {
            isoCode
            name
        }
    }
`;

type Props = {
    namePrefix?: string;
} & Partial<DefaultProps>;

type DefaultProps = Readonly<typeof defaultProps>;

const defaultProps = {
    allCountries: true,
};

const getProps = createPropsGetter(defaultProps);

class Address extends React.PureComponent<Props & WithApolloProps> {
    public render() {
        const { namePrefix, allCountries } = getProps(this.props);
        return (
            <>
                <div className="form-double-field-line">
                    <Field name={getName('firstName', namePrefix)} placeholder="First name" />
                    <Field name={getName('lastName', namePrefix)} placeholder="Last name" />
                </div>
                <Field name={getName('line1', namePrefix)} placeholder="Street" />
                <Field name={getName('line2', namePrefix)} placeholder="Apt/unit etc (optional)" />
                <div className="form-double-field-line">
                    <Field name={getName('city', namePrefix)} placeholder="City" />
                    <Field name={getName('postalCode', namePrefix)} placeholder="Postal code" />
                </div>
                <Field name={getName('state', namePrefix)} placeholder="State" />
                {allCountries ? (
                    <Select
                        name={getName('country', namePrefix)}
                        placeholder="Country"
                        options={formatCountries(countries)}
                        menuMaxHeight={200}
                        isSearchable
                    />
                ) : (
                    <Select
                        name={getName('country', namePrefix)}
                        placeholder="Country"
                        loadOptions={this.queryCountries}
                        menuMaxHeight={200}
                    />
                )}
            </>
        );
    }

    private queryCountries = (_inputValue: string, callback: (options: {}[]) => void) => {
        this.props.apolloClient
            .query<any>({
                query: GET_COUNTRIES,
            })
            .then((result) => {
                const options = result.data.countries.map((country) => ({
                    label: country.name,
                    value: country.isoCode,
                }));

                callback(options);
            });
    };
}

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

export default withApollo(Address);
