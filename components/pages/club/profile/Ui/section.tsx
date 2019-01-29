import React from 'react';

import EditButton from 'components/Ui/Button/Edit/editButton';

type Props = {
    title?: string;
    edit?: boolean;
    editTitle?: string;
    onEditClick?: (fct: any) => void;
};

const ProfileSection: React.SFC<Props> = ({ children, title, edit, onEditClick, editTitle }) => (
    <section className="profile-section">
        <header className="profile-section-header">
            {title && <h2 className="profile-section-header-title">{title}</h2>}
            {edit && <EditButton onClick={onEditClick} content={editTitle} />}
        </header>
        {children}
    </section>
);

export default ProfileSection;
