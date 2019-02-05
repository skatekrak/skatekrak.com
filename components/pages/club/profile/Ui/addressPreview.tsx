import React from 'react';

type Props = {
    address: any;
};

const AddressPreview: React.SFC<Props> = ({ address }) => (
    <div className="profile-address-preview">
        <p className="profile-address-preview-line">
            {address.firstName} {address.lastName}
        </p>
        <p className="profile-address-preview-line">
            {address.street}, {address.apt}
        </p>
        <p className="profile-address-preview-line">
            {address.cityCode} {address.city}
        </p>
        <p className="profile-address-preview-line">
            {address.state}, {address.country}
        </p>
    </div>
);

export default AddressPreview;
