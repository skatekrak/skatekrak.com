import React from 'react';

import IconDownload from 'components/Ui/Icons/Download';
import IconFull from 'components/Ui/Icons/iconFull';

type Props = {
    payment: object;
};

const PaymentLine: React.SFC<Props> = ({ payment }) => (
    <div className="profile-payment-history-line">
        <span className="profile-payment-history-line-desc">{payment.desc}</span>
        <div className="profile-payment-history-line-details">
            <span className="profile-payment-history-line-details-date">{payment.date}</span>
            <span className="profile-payment-history-line-details-price">{payment.price}</span>
            <button onClick={null} className="profile-payment-history-line-details-download">
                <IconFull icon={<IconDownload />} />
            </button>
        </div>
    </div>
);

export default PaymentLine;
