import React from 'react';

import countries from 'lib/countries';

type Props = {
    address: any;
};

const BillingAddress = ({ address }: Props) => (
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
            {address.country && countries[address.country.toUpperCase()]}
        </p>
    </div>
);

export default BillingAddress;
