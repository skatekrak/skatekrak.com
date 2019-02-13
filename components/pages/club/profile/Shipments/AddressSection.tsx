import React from 'react';

import AddressNav from 'components/pages/club/profile/Ui/AddressNav';
import AddressPreview from 'components/pages/club/profile/Ui/addressPreview';
import ProfileSection from 'components/pages/club/profile/Ui/section';
import ProfileSectionHeader from 'components/pages/club/profile/Ui/sectionHeader';

type Props = {
    address: any;
    onEdit: (address: any) => void;
    onDelete: (address: any) => void;
    setAsDefault: (address: any) => void;
};

const AddressSection = ({ address, onEdit, onDelete, setAsDefault }: Props) => {
    const onEditClick = () => {
        onEdit(address);
    };

    const onDeleteClick = () => {
        onDelete(address);
    };

    const setAsDefaultClick = () => {
        setAsDefault(address);
    };

    return (
        <ProfileSection>
            <ProfileSectionHeader edit editTitle={address.title} onEditClick={onEditClick}>
                <AddressNav
                    isDefault={address.default}
                    name={address.name}
                    onDeleteClick={onDeleteClick}
                    setAsDefault={setAsDefaultClick}
                />
            </ProfileSectionHeader>
            <div className="profile-section-line">
                <AddressPreview address={address} />
            </div>
        </ProfileSection>
    );
};

export default AddressSection;
