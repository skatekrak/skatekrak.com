import React from 'react';

import EditButton from 'components/Ui/Button/Edit/editButton';

type Props = {
    title?: string;
    edit?: boolean;
    editTitle?: string;
    onEditClick?: (fct: any) => void;
};

const SectionHeader: React.SFC<Props> = ({ children, title, edit, onEditClick, editTitle }) => (
    <header className="profile-section-header">
        <div className="profile-section-header-main">
            {title && <h2 className="profile-section-header-main-title">{title}</h2>}
            {children && children}
        </div>
        {edit && <EditButton onClick={onEditClick} content={editTitle} />}
    </header>
);

export default SectionHeader;
