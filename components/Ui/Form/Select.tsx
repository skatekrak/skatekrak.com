/*
 * Npm import
 */
import * as React from 'react';

/*
 * Local import
 */

/*
 * Code
 */
type Props = {
    value?: string;
    name: string;
    options: {
        value: string;
        title: string;
    }[];
    required?: boolean;
    disabled?: boolean;
};

type State = {
    value: string;
};

export default class Select extends React.Component<Props, State> {
    public state: State = {
        value: '',
    };

    public componentDidMount() {
        if (this.props.value) {
            this.setState({ value: this.props.value });
        }
    }

    /**
     * Handle change event
     */
    public handleChange = (evt: any) => {
        const { value } = evt.target;
        this.setState({ value });
    };

    /*
     * Render
     */
    public render() {
        const { value } = this.state;
        const { name, options, required, disabled } = this.props;
        const id = `id-${name}`;
        return (
            <select
                id={id}
                value={value}
                name={name}
                onChange={this.handleChange}
                required={required}
                disabled={disabled}
            >
                <option value="" disabled>
                    Choose
                </option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.title}
                    </option>
                ))}
            </select>
        );
    }
}
