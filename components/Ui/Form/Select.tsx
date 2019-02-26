import classnames from 'classnames';
import React from 'react';
import { Field } from 'react-final-form';
import ReactSelect from 'react-select';
import AsyncSelect from 'react-select/lib/Async';

import ErrorMessage from 'components/Ui/Form/ErrorMessage';

import createPropsGetter from 'lib/getProps';

const customSelectStyles = {
    control: (styles, state) => ({
        ...styles,
        border: '0',
        boxShadow: state.isFocused ? '0 0 0 1px #4D4D4D' : 'none',
        minHeight: '3rem',
        // borderColor: state.isFocused ? '' : '',
    }),
    valueContainer: (styles) => ({ ...styles, padding: '.75rem 1rem' }),
    singleValue: (styles) => ({ ...styles, margin: '0', padding: '0' }),
    input: (styles) => ({ ...styles, padding: '0', margin: '0' }),
    menu: (styles) => ({
        ...styles,
        borderRadius: '.25rem',
        boxShadow: '0px 0px 8px 0px hsla(0,0%,0%,0.1), 0 4px 11px hsla(0,0%,0%,0.1)',
    }),
    option: (styles, state) => ({
        ...styles,
        backgroundColor: state.isSelected ? '#1F1F1F' : 'transparent',
        '&:hover': {
            backgroundColor: state.isSelected ? '#1F1F1F' : '#CCCCCC',
        },
    }),
};

type Props = {
    name: string;
    label?: string;
    showValid?: boolean;
    loadOptions?: (inputValue: string, callback: (options: {}[]) => void) => void | Promise<any>;
    options?: { value: string; label: string }[];
    placeholder?: string;
    menuMaxHeight?: number;
} & Partial<DefaultProps>;

type DefaultProps = Readonly<typeof defaultProps>;

const defaultProps = {
    isClearable: true,
    isMulti: false,
    disabled: false,
    isSearchable: false,
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
                                {props.loadOptions ? (
                                    <AsyncSelect
                                        value={input.value}
                                        defaultOptions={props.options === undefined ? true : props.options}
                                        loadOptions={props.loadOptions}
                                        onChange={input.onChange}
                                        onBlur={input.onBlur}
                                        isClearable={props.isClearable}
                                        isMulti={props.isMulti}
                                        isDisabled={props.disabled}
                                        placeholder={props.placeholder}
                                        maxMenuHeight={props.menuMaxHeight}
                                        styles={customSelectStyles}
                                    />
                                ) : (
                                    <ReactSelect
                                        isSearchable={props.isSearchable}
                                        value={input.value}
                                        options={props.options}
                                        onChange={input.onChange}
                                        onBlur={input.onBlur}
                                        isClearable={props.isClearable}
                                        isMulti={props.isMulti}
                                        isDisabled={props.disabled}
                                        placeholder={props.placeholder}
                                        maxMenuHeight={props.menuMaxHeight}
                                        styles={customSelectStyles}
                                    />
                                )}

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
