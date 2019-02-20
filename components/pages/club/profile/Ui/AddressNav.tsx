import classNames from 'classnames';
import React from 'react';

import ButtonWithLabel from 'components/Ui/Button/buttonWithLabel';
import IconFull from 'components/Ui/Icons/iconFull';
import IconStarFull from 'components/Ui/Icons/StarFull';
import IconTrash from 'components/Ui/Icons/Trash';

type Props = {
    isDefault: boolean;
    name: string;
    onDeleteClick: () => void;
    setAsDefault: () => void;
};

const AddressNav = ({ isDefault, name, onDeleteClick, setAsDefault }: Props) => (
    <div className="profile-address-nav">
        <span className="profile-address-nav-item">
            {isDefault ? (
                <span
                    className={classNames('profile-address-nav-item-status', {
                        'profile-address-nav-item-status--active': isDefault,
                    })}
                >
                    <IconFull icon={<IconStarFull />} />
                    Current shipping address
                </span>
            ) : (
                <button
                    className={classNames('profile-address-nav-item-status', {
                        'profile-address-nav-item-status--active': isDefault,
                    })}
                    onClick={setAsDefault}
                >
                    <IconFull icon={<IconStarFull />} />
                    Set as current shipping address
                </button>
            )}
        </span>
        {!isDefault && (
            <ButtonWithLabel actionLabel="delete" content={name} icon={<IconTrash />} onClick={onDeleteClick} />
        )}
    </div>
);

export default AddressNav;
