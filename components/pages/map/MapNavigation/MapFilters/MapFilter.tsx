import classNames from 'classnames';
import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from 'store/reducers';

import { Types, Status } from 'lib/carrelageClient';
import { SpinnerCircle } from 'components/Ui/Icons/Spinners';
import { toggleMapFilter } from 'store/map/actions';
import { FilterStateUtil, FilterState } from 'lib/FilterState';

type Props = {
    filter: Types | Status;
    icon: JSX.Element;
};

const MapFilter: React.FC<Props> = ({ filter, icon }) => {
    const [isActive, setIsActive] = useState(true);
    const [loading, setLoading] = useState(false);
    const mapState = useSelector((state: RootState) => state.map);
    const dispatch = useDispatch();

    const handleOnClick = useCallback(() => {
        dispatch(toggleMapFilter(filter));
        // setIsActive(!isActive);
    }, [dispatch]);

    useEffect(() => {
        if (Object.values(Types).includes(filter as any)) {
            setIsActive(FilterStateUtil.isSelected(mapState.types[filter as Types]));
        } else if (Object.values(Status).includes(filter as any)) {
            setIsActive(FilterStateUtil.isSelected(mapState.status[filter as Status]));
        }
    }, [mapState]);

    useEffect(() => {
        if (Object.values(Types).includes(filter as any)) {
            const filterState = mapState.types[filter as Types];
            if (filterState === FilterState.LOADING_TO_SELECTED || filterState === FilterState.LOADING_TO_UNSELECTED) {
                setLoading(true);
            } else {
                setLoading(false);
            }
        } else if (Object.values(Status).includes(filter as any)) {
            const filterState = mapState.status[filter as Status];
            if (filterState === FilterState.LOADING_TO_SELECTED || filterState === FilterState.LOADING_TO_UNSELECTED) {
                setLoading(true);
            } else {
                setLoading(false);
            }
        }
    }, [mapState]);

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

export default React.memo(MapFilter);
