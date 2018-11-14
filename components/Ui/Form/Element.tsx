import * as React from 'react';
import classNames from 'classnames';

import 'static/styles/form.styl';

type Props = {
    label: string;
    children: React.ReactElement<React.ReactChildren>;
    invalid: boolean;
};

export default class Element extends React.Component<Props> {
    public render() {
        const { label, children, invalid } = this.props;
        const elementId = `id-${children.props.name}`;

        return (
            <React.Fragment>
                <div className="form-element-label">
                    <label htmlFor={elementId}>{label}</label>
                </div>
                <div
                    className={classNames('form-element-field', {
                        'form-element-field--error': invalid,
                    })}
                >
                    {children}
                </div>
            </React.Fragment>
        );
    }
}
