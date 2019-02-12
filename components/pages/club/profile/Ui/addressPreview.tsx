import React from 'react';

type Props = {
    name: string;
    address: any;
};

const AddressPreview: React.SFC<Props> = ({ name, address }) => (
    <div className="profile-address-preview">
        <p className="profile-address-preview-line">{name}</p>
        <p className="profile-address-preview-line">
            {address.line1}
            {address.line2 ? ', ' : ''}
            {address.line2}
        </p>
        <p className="profile-address-preview-line">
            {address.zip} {address.city}
        </p>
        <p className="profile-address-preview-line">
            {address.state}
            {address.state ? ', ' : ''}
            {address.country}
        </p>
    </div>
);

export default AddressPreview;
