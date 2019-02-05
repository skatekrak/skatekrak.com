import classnames from 'classnames';
import React from 'react';
import { Field } from 'react-final-form';

import ErrorMessage from 'components/Ui/Form/ErrorMessage';

const FieldContainer = (props: any) => (
    <Field name={props.name}>
        {({ input, meta }) => {
            const showError = (meta.error || meta.submitError) && meta.touched;
            return (
                <>
                    <div className="form-element-label">
                        {!props.withoutLabel && <label htmlFor={props.name}>{props.label}</label>}
                    </div>
                    <div
                        className={classnames('form-element-field', {
                            'form-element-field--error': showError,
                            'form-element-field--success': props.showValid,
                        })}
                    >
                        <input {...input} {...props} />
                        {showError && <ErrorMessage message={meta.error || meta.submitError} />}
                    </div>
                </>
            );
        }}
    </Field>
);

export default FieldContainer;
