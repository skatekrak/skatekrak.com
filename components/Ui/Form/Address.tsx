import * as React from 'react';

import FormElement from 'components/Ui/Form/Element';
import Input from 'components/Ui/Form/Input';
import Select from 'components/Ui/Form/Select';

const options = [
    {
        code: 'pt',
        name: 'Portugal',
    },
    {
        code: 'fr',
        name: 'France',
    },
    {
        code: 'es',
        name: 'Spain',
    },
];

type Props = {
    address?: object;
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
                <FormElement label="First name *">
                    <Input type="text" name="user-first-name" required />
                </FormElement>
                <FormElement label="Last name *">
                    <Input type="text" name="user-last-name" required />
                </FormElement>
                <FormElement label="Address line 1 *">
                    <Input type="text" name="user-address-1" required />
                </FormElement>
                <FormElement label="Address line 2">
                    <Input type="text" name="user-address-2" />
                </FormElement>
                <FormElement label="City *">
                    <Input type="text" name="user-city" required />
                </FormElement>
                <FormElement label="Zip code *">
                    <Input type="text" name="user-zip" required />
                </FormElement>
                <FormElement label="Country *">
                    <Select name="country" options={options} required />
                </FormElement>
            </React.Fragment>
        );
    }
}
