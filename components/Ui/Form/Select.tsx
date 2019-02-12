import classnames from 'classnames';
import React from 'react';
import { Field } from 'react-final-form';
import ReactSelect from 'react-select';

import ErrorMessage from 'components/Ui/Form/ErrorMessage';

import createPropsGetter from 'lib/getProps';

type Props = {
    name: string;
    label?: string;
    showValid?: boolean;
    options: { value: string; label: string }[];
} & Partial<DefaultProps>;

type DefaultProps = Readonly<typeof defaultProps>;

const defaultProps = {
    isClearable: true,
    isMulti: false,
};

const getProps = createPropsGetter(defaultProps);

const Select = (rawProps: Props) => {
    const props = getProps(rawProps);
    return (
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
                            <>
                                <ReactSelect
                                    value={input.value}
                                    options={props.options}
                                    onChange={input.onChange}
                                    onBlur={input.onBlur}
                                    isClearable={props.isClearable}
                                    isMulti={props.isMulti}
                                />
                                {showError && <ErrorMessage message={meta.error || meta.submitError} />}
                            </>
                        </div>
                    );
                }}
            </Field>
        </div>
    );
};

export default Select;
