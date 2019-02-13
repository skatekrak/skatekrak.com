import classnames from 'classnames';
import React from 'react';
import { Field } from 'react-final-form';
import AsyncSelect from 'react-select/lib/Async';

import ErrorMessage from 'components/Ui/Form/ErrorMessage';

import createPropsGetter from 'lib/getProps';

type Props = {
    name: string;
    label?: string;
    showValid?: boolean;
    loadOptions?: (inputValue: string, callback: (options: {}[]) => void) => void | Promise<any>;
    options?: { value: string; label: string }[];
} & Partial<DefaultProps>;

type DefaultProps = Readonly<typeof defaultProps>;

const defaultProps = {
    isClearable: true,
    isMulti: false,
    disabled: false,
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
                                <AsyncSelect
                                    value={input.value}
                                    defaultOptions={props.options === undefined ? true : props.options}
                                    loadOptions={props.loadOptions}
                                    onChange={input.onChange}
                                    onBlur={input.onBlur}
                                    isClearable={props.isClearable}
                                    isMulti={props.isMulti}
                                    isDisabled={props.disabled}
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
