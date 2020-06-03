import classNames from 'classnames';
import React, { useState } from 'react';

import { FilterName } from './index';

type Props = {
    name: FilterName;
    icon: JSX.Element;
    onFilterClick: (name: FilterName) => void;
};

const MapFilter: React.FC<Props> = ({ name, icon, onFilterClick }) => {
    const [isActive, setIsActive] = useState(true);

    const handleOnClick = () => {
        setIsActive(!isActive);
        onFilterClick(name);
    };

    return (
        <button
            className={classNames(`map-navigation-filter map-navigation-filter-${name}`, {
                'map-navigation-filter-inactive': !isActive,
            })}
            onClick={handleOnClick}
        >
            {icon}
        </button>
    );
};

export default MapFilter;
