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
    />
));

export default RenderSelect;
