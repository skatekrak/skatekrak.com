import React from 'react';

import FormElement from 'components/Ui/Form/Element';

export const createRenderer = (render) => ({ input, meta, label, ...rest }) => (
    <React.Fragment>
        <FormElement label={label}>{render(input, rest)}</FormElement>
        {meta.error && meta.touched && !meta.active && <span>{meta.error}</span>}
    </React.Fragment>
);
