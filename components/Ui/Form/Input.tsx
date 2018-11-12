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
    type: string;
    name: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
};

type State = {
    type: string;
    value: string;
};

export default class Input extends React.Component<Props, State> {
    public state: State = {
        type: this.props.type,
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
        const { type, value } = this.state;
        const { name, placeholder, required, disabled } = this.props;
        const id = `id-${name}`;
        return (
            <input
                /* HTML */
                id={id}
                type={type}
                name={name}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                /* React */
                value={value}
                onChange={this.handleChange}
            />
        );
    }
}
