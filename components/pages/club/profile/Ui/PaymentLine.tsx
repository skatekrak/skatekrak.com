import Tooltip from 'components/Ui/Tooltip';
import format from 'date-fns/format';
import React from 'react';

import IconDownload from 'components/Ui/Icons/Download';
import IconFull from 'components/Ui/Icons/iconFull';

type Props = {
    payment: any;
};

const PaymentLine: React.SFC<Props> = ({ payment }) => (
    <div className="profile-payment-history-line">
        <span className="profile-payment-history-line-desc">{payment.description}</span>
        <div className="profile-payment-history-line-details">
            <span className="profile-payment-history-line-details-date">
                {payment.createdAt ? format(payment.createdAt, 'DD MMMM YYYY').toLowerCase() : ''}
            </span>
            <span className="profile-payment-history-line-details-price">{payment.amount / 100 + '€'}</span>
            <Tooltip />
            <button
                data-tip="Download invoice"
                onClick={null}
                className="profile-payment-history-line-details-download"
            >
                <IconFull icon={<IconDownload />} />
            </button>
        </div>
    </div>
);

export default PaymentLine;
