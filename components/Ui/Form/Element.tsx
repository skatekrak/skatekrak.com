import classNames from 'classnames';
import React from 'react';

import 'static/styles/form.styl';

type Props = {
    label: string;
    children: React.ReactElement<React.ReactChildren>;
    invalid: boolean;
    valid?: boolean;
};

export default class Element extends React.Component<Props> {
    public render() {
        const { label, children, invalid, valid } = this.props;
        const elementId = `id-${children.props.name}`;

        return (
            <React.Fragment>
                <div className="form-element-label">
                    <label htmlFor={elementId}>{label}</label>
                </div>
                <div
                    className={classNames('form-element-field', {
                        'form-element-field--error': invalid,
                        'form-element-field--success': valid,
                    })}
                >
                    {children}
                </div>
            </React.Fragment>
        );
    }
}
