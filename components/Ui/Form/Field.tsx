import classnames from 'classnames';
import React from 'react';
import { Field } from 'react-final-form';

import ErrorMessage from 'components/Ui/Form/ErrorMessage';

type Props = {
    name: string;
    label?: string;
    showValid?: boolean;
};

const FieldContainer = (props: Props) => (
    <div className="form-element">
        {props.label && (
            <div className="form-element-label">
                <label htmlFor={props.name}>{props.label}</label>
            </div>
        )}
        <Field name={props.name}>
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

export default FieldContainer;
