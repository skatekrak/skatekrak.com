import React from 'react';

type Props = {
    address: any;
};

const ShippingAddress = ({ address }: Props) => (
    <div className="profile-address-preview">
        <p className="profile-address-preview-line">
            {address.firstName} {address.lastName}
        </p>
        <p className="profile-address-preview-line">
            {address.line1}
            {address.line2 && `, ${address.line2}`}
        </p>
        <p className="profile-address-preview-line">
            {address.postalCode} {address.city}
        </p>
        <p className="profile-address-preview-line">
            {address.state && `${address.state}, `}
            {address.country.name}
        </p>
    </div>
);

export default ShippingAddress;
