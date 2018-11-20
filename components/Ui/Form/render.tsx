import React from 'react';

import FormElement from 'components/Ui/Form/Element';
import ErrorMessage from 'components/Ui/Form/ErrorMessage';

export const createRenderer = (render) => ({ input, meta, label, showValid, ...rest }) => (
    <div className="form-element">
        <FormElement
            invalid={meta.error && meta.touched && !meta.active}
            valid={showValid && (!meta.pristine && !meta.error && !meta.active)}
            label={label}
        >
            {render(input, rest)}
        </FormElement>
        {meta.error && meta.touched && !meta.active && <ErrorMessage message={meta.error} />}
    </div>
);
