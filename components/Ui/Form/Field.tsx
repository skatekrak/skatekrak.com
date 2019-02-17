import classnames from 'classnames';
import { FieldState } from 'final-form';
import React from 'react';
import { Field } from 'react-final-form';

import ErrorMessage from 'components/Ui/Form/ErrorMessage';

import createPropsGetter from 'lib/getProps';

type Props = {
    name: string;
    label?: string;
    showValid?: boolean;
    placeholder?: string;
    type?: string;
    validate?: (value: any, allValues: object) => any;
} & Partial<DefaultProps>;

type DefaultProps = Readonly<typeof defaultProps>;

const defaultProps = {
    disabled: false,
};

const getProps = createPropsGetter(defaultProps);

const FieldContainer = (rawProps: Props) => {
    const props = getProps(rawProps);
    return (
        <div className="form-element" data-element-name={props.name}>
            {props.label && (
                <div className="form-element-label">
                    <label htmlFor={props.name}>{props.label}</label>
                </div>
            )}
            <Field name={props.name} validate={props.validate}>
                {({ input, meta }) => {
                    let showError = (meta.error || meta.submitError) && meta.touched;
                    if (meta.dirtySinceLastSubmit) {
                        showError = false;
                    }
                    return (
                        <div
                            className={classnames('form-element-field', {
                                'form-element-field--error': showError,
                                'form-element-field--success': props.showValid,
                            })}
                        >
                            <input {...input} {...props} />
                            {showError && <ErrorMessage message={meta.error || meta.submitError} />}
                        </div>
                    );
                }}
            </Field>
        </div>
    );
};

export default FieldContainer;
