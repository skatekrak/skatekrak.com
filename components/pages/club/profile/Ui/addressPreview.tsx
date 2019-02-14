import React from 'react';

type Props = {
    address: any;
};

const AddressPreview: React.SFC<Props> = ({ address }) => (
    <div className="profile-address-preview">
        <p className="profile-address-preview-line">{address.name}</p>
        <p className="profile-address-preview-line">
            {address.line1}
            {address.line2 && `, ${address.line2}`}
        </p>
        <p className="profile-address-preview-line">
            {address.zip} {address.city}
        </p>
        <p className="profile-address-preview-line">
            {address.state && `${address.state}, `}
            {address.country}
        </p>
    </div>
);

export default AddressPreview;
