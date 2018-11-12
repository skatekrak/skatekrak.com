import * as React from 'react';

import FormElement from 'components/Ui/Form/Element';
import RenderInput from 'components/Ui/Form/Input';
import Select from 'components/Ui/Form/Select';
import { Field } from 'redux-form';

type Props = {
    address?: object;
    countries: {
        value: string;
        title: string;
    }[];
};

type State = {
    address: object;
};

export default class Element extends React.Component<Props, State> {
    public state: State = {
        address: {},
    };
    public render() {
        return (
            <React.Fragment>
                <Field label="First name" name="firstName" component={RenderInput} type="text" required />
                <Field label="Last name" name="lastName" component={RenderInput} type="text" required />
                <Field label="Address" name="line1" component={RenderInput} type="text" required />
                <Field label="Apt/unit etc (optional)" name="line2" component={RenderInput} type="text" />
                <Field label="City" name="city" component={RenderInput} type="text" required />
                <Field label="Postal code" name="postalcode" component={RenderInput} type="text" required />
                <FormElement label="Country">
                    <Select name="country" options={this.props.countries} required />
                </FormElement>
            </React.Fragment>
        );
    }
}
