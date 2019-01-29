/*
 * Npm import
 */
import * as React from 'react';

/*
 * Local import
 */
import IconEdit from 'components/Ui/Icons/Edit';

/*
 * Code
 */
type Props = {
    onClick: (fct: any) => void;
    content: string;
};

const EditButton: React.SFC<Props> = ({ onClick, content }) => (
    <button className="edit-button button-primary" onClick={onClick}>
        <span className="edit-button-icon">
            <IconEdit />
        </span>
        <span className="edit-button-icon-text">Edit </span>
        {content}
    </button>
);

/*
 * Export Default
 */
export default EditButton;
