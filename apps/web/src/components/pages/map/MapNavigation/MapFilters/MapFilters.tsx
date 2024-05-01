import React from 'react';

import { Types, Status } from '@krak/carrelage-client';
import DiyIcon from '@/components/pages/map/marker/icons/Diy';
import ParkIcon from '@/components/pages/map/marker/icons/Park';
import PrivateIcon from '@/components/pages/map/marker/icons/Private';
import RipIcon from '@/components/pages/map/marker/icons/Rip';
import ShopIcon from '@/components/pages/map/marker/icons/Shop';
import StreetIcon from '@/components/pages/map/marker/icons/Street';
import WipIcon from '@/components/pages/map/marker/icons/Wip';

import * as S from './MapFilters.styled';
import MapFilter from './MapFilter';

const MapFilters = () => {
    return (
        <S.MapFiltersContainer>
            <MapFilter filter={Types.Street} icon={<StreetIcon />} />
            <MapFilter filter={Types.Park} icon={<ParkIcon />} />
            <MapFilter filter={Types.Diy} icon={<DiyIcon />} />
            <MapFilter filter={Types.Private} icon={<PrivateIcon />} />
            <MapFilter filter={Types.Shop} icon={<ShopIcon />} />
            <MapFilter filter={Status.Wip} icon={<WipIcon />} />
            <MapFilter filter={Status.Rip} icon={<RipIcon />} />
        </S.MapFiltersContainer>
    );
};

export default React.memo(MapFilters);
