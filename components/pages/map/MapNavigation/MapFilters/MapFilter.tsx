import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { Types, Status } from 'lib/carrelageClient';
import { SpinnerCircle } from 'components/Ui/Icons/Spinners';
import { toggleMapFilter } from 'store/map/slice';
import { FilterStateUtil, FilterState } from 'lib/FilterState';

import * as S from './MapFilters.styled';
import { useAppSelector } from 'store/hook';

type Props = {
    filter: Types | Status;
    icon: JSX.Element;
};

const MapFilter: React.FC<Props> = ({ filter, icon }) => {
    const [loading, setLoading] = useState(false);
    const [status, types] = useAppSelector((state) => [state.map.status, state.map.types]);

    const dispatch = useDispatch();

    const handleOnClick = useCallback(() => {
        dispatch(toggleMapFilter(filter));
    }, [dispatch]);

    const isActive = useMemo(() => {
        if (Object.values(Types).includes(filter as any)) {
            return FilterStateUtil.isSelected(types[filter as Types]);
        } else if (Object.values(Status).includes(filter as any)) {
            return FilterStateUtil.isSelected(status[filter as Status]);
        }
    }, [status, types]);

    useEffect(() => {
        if (Object.values(Types).includes(filter as any)) {
            const filterState = types[filter as Types];
            if (filterState === FilterState.LOADING_TO_SELECTED || filterState === FilterState.LOADING_TO_UNSELECTED) {
                setLoading(true);
            } else {
                setLoading(false);
            }
        } else if (Object.values(Status).includes(filter as any)) {
            const filterState = status[filter as Status];
            if (filterState === FilterState.LOADING_TO_SELECTED || filterState === FilterState.LOADING_TO_UNSELECTED) {
                setLoading(true);
            } else {
                setLoading(false);
            }
        }
    }, [status, types]);

    return (
        <S.MapFilterContainer filter={filter} isActive={isActive} isLoading={loading} onClick={handleOnClick}>
            {loading ? <SpinnerCircle /> : icon}
        </S.MapFilterContainer>
    );
};

export default React.memo(MapFilter);
