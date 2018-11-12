import * as React from 'react';

import 'static/styles/form.styl';

type Props = {
    label: string;
    children: React.ReactElement<React.ReactChildren>;
};

type State = {
    errorMessage?: string;
};

export default class Element extends React.Component<Props, State> {
    public state: State = {
        errorMessage: null,
    };

    public render() {
        const { label, children } = this.props;
        const elementId = `id-${children.props.name}`;

        return (
            <div className="form-element">
                <div className="form-element-label">
                    <label htmlFor={elementId}>{label}</label>
                </div>
                <div className="form-element-field">{children}</div>
            </div>
        );
    }
}
