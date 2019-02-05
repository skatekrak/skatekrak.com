import classNames from 'classnames';
import React from 'react';

import ButtonWithLabel from 'components/Ui/Button/buttonWithLabel';
import IconFull from 'components/Ui/Icons/iconFull';
import IconStarFull from 'components/Ui/Icons/StarFull';
import IconTrash from 'components/Ui/Icons/Trash';

type Props = {
    address: any;
    onDeleteClick: (fct: any) => void;
};

const AddressNav: React.SFC<Props> = ({ address, onDeleteClick }) => (
    <div className="profile-address-nav">
        <span className="profile-address-nav-item">
            {address.actual ? (
                <span
                    className={classNames('profile-address-nav-item-status', {
                        'profile-address-nav-item-status--active': address.actual,
                    })}
                >
                    <IconFull icon={<IconStarFull />} />
                    Actual shipping address
                </span>
            ) : (
                <button
                    className={classNames('profile-address-nav-item-status', {
                        'profile-address-nav-item-status--active': address.actual,
                    })}
                >
                    <IconFull icon={<IconStarFull />} />
                    Set as shipping address
                </button>
            )}
        </span>
        <ButtonWithLabel actionLabel="delete" content="address 1" icon={<IconTrash />} onClick={onDeleteClick} />
    </div>
);

export default AddressNav;
