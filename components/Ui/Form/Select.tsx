/*
 * Npm import
 */
import * as React from 'react';
import ReactSelect from 'react-select';

/*
 * Local import
 */
import { createRenderer } from 'components/Ui/Form/render';

/*
 * Code
 */
const customStyles = {
    control: (styles) => ({ ...styles, borderRadius: '0', border: '0', maxHeight: '3rem' }),
    valueContainer: (styles) => ({ ...styles, padding: '.75rem 1rem', maxHeight: '3rem' }),
    singleValue: (styles) => ({ ...styles, margin: '0', padding: '0' }),
    input: (styles) => ({ ...styles, padding: '0', margin: '0', maxHeight: '3rem' }),
    menu: (styles) => ({ ...styles, borderRadius: '0' }),
};

/* tslint:disable:jsx-no-lambda */
const RenderSelect = createRenderer((input, rest) => (
    <ReactSelect
        {...input}
        defaultValue={rest.value}
        isDisabled={rest.disabled}
        isSearchable
        name={rest.name}
        options={rest.options}
        onChange={(value) => input.onChange(value)}
        onBlur={() => input.onBlur()}
        styles={customStyles}
    />
));

export default RenderSelect;
