/*
 * Npm import
 */
import * as React from 'react';

/*
 * Local import
 */
import IconEdit from '@/components/Ui/Icons/IconEdit';

/*
 * Code
 */
type EditButtonProps = {
    onClick: () => void;
    content: string;
    name: string;
};

const EditButton = ({ name, onClick, content }: EditButtonProps) => (
    <button data-name={name} className="edit-button button-primary" onClick={onClick}>
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
