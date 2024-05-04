import { memo } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { Types, Status } from '@krak/carrelage-client';

import * as S from './MapFilters.styled';
import { useMapStore } from '@/store/map';

type MapFilterProps = {
    filter: Types | Status;
    icon: JSX.Element;
};

const MapFilter = ({ filter, icon }: MapFilterProps) => {
    const [filters, toggleFilter] = useMapStore(useShallow((state) => [state.filters, state.toggleFilter]));

    const handleOnClick = () => {
        toggleFilter(filter);
    };

    const isActive = filters.includes(filter);

    return (
        <S.MapFilterContainer filter={filter} isActive={isActive} onClick={handleOnClick}>
            {icon}
        </S.MapFilterContainer>
    );
};

export default memo(MapFilter);
