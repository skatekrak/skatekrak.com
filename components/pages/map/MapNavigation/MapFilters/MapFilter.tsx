import classNames from 'classnames';
import React, { useState } from 'react';

import { Types, Status } from 'lib/carrelageClient';
import { SpinnerCircle } from 'components/Ui/Icons/Spinners';

type Props = {
    loading: boolean;
    filter: Types | Status;
    icon: JSX.Element;
    onFilterClick: (filter: Types | Status, active: boolean) => void;
};

const MapFilter: React.FC<Props> = ({ loading, filter, icon, onFilterClick }) => {
    const [isActive, setIsActive] = useState(true);

    const handleOnClick = () => {
        onFilterClick(filter, !isActive);
        setIsActive(!isActive);
    };

    return (
        <button
            className={classNames(`map-navigation-filter map-navigation-filter-${filter}`, {
                'map-navigation-filter-inactive': !isActive,
                'map-navigation-filter-loading': loading,
            })}
            onClick={handleOnClick}
        >
            {loading ? <SpinnerCircle /> : icon}
        </button>
    );
};

export default MapFilter;
