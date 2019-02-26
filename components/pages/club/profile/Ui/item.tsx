import React from 'react';

type Props = {
    title: string;
    content: string;
};

const ProfileItem: React.SFC<Props> = ({ title, content }) => (
    <div className="profile-section-item">
        <h4 className="profile-section-item-title">{title}</h4>
        <p className="profile-section-item-content">
            {content ? content : <span className="profile-section-item-content-empty">Not completed</span>}
        </p>
    </div>
);

export default ProfileItem;
