import React from 'react';

import FormElement from 'components/Ui/Form/Element';
import ErrorMessage from 'components/Ui/Form/ErrorMessage';

export const createRenderer = (render) => ({ input, meta, label, ...rest }) => (
    <div className="form-element">
        <FormElement invalid={meta.error && meta.touched && !meta.active} label={label}>
            {render(input, rest)}
        </FormElement>
        {meta.error && meta.touched && !meta.active && <ErrorMessage message={meta.error} />}
    </div>
);
