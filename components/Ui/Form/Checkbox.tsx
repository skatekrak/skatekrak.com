/*
 * Npm import
 */
import * as React from 'react';

/*
 * Local import
 */

/*
 * Code
 */
type Props = {
    checked: boolean;
    id: string;
};

const Checkbox = ({ checked, id }: Props) => (
    <input className="checkbox" type="checkbox" id={`input-${id}`} name={`input-${id}`} checked={checked} />
);

export default Checkbox;
