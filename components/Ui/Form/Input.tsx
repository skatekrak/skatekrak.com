/*
 * Npm import
 */
import * as React from 'react';

import { createRenderer } from 'components/Ui/Form/render';

/*
 * Local import
 */

/*
 * Code
 */
const RenderInput = createRenderer((input, rest) => (
    <input
        {...input}
        autoCapitalize={rest.autoCapitalize}
        autoCorrect={rest.autoCorrect}
        placeholder={rest.placeholder}
    />
));

export default RenderInput;
