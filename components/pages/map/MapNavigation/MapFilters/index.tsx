import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Typings from 'Types';

import { Types, Status } from 'lib/carrelageClient';
import { setMapSpotsStatus, setMapSpotsType } from 'store/map/actions';
import DiyIcon from 'components/pages/map/marker/icons/Diy';
import ParkIcon from 'components/pages/map/marker/icons/Park';
import PrivateIcon from 'components/pages/map/marker/icons/Private';
import RipIcon from 'components/pages/map/marker/icons/Rip';
import ShopIcon from 'components/pages/map/marker/icons/Shop';
import StreetIcon from 'components/pages/map/marker/icons/Street';
import WipIcon from 'components/pages/map/marker/icons/Wip';

import MapFilter from './MapFilter';

const index = () => {
    const mapState = useSelector((state: Typings.RootState) => state.map);
    const dispatch = useDispatch();

    const onFilterClick = (filter: Types | Status, active: boolean) => {
        // Has to cast to an any, otherwise an error is trigger even though it's completely valid
        if (Object.values(Types).includes(filter as any)) {
            const { types } = mapState;
            const selectedTypes = new Set(types);
            if (active) {
                selectedTypes.add(filter as Types);
            } else {
                selectedTypes.delete(filter as Types);
            }
            dispatch(setMapSpotsType(Array.from(selectedTypes)));
        } else {
            const { status } = mapState;
            const selectedStatus = new Set(status);
            if (active) {
                selectedStatus.add(filter as Status);
            } else {
                selectedStatus.delete(filter as Status);
            }
            dispatch(setMapSpotsStatus(Array.from(selectedStatus)));
        }
    };

    return (
        <div id="map-navigation-filters">
            <MapFilter loading={false} filter={Types.Street} icon={<StreetIcon />} onFilterClick={onFilterClick} />
            <MapFilter loading={false} filter={Types.Park} icon={<ParkIcon />} onFilterClick={onFilterClick} />
            <MapFilter loading={false} filter={Types.Diy} icon={<DiyIcon />} onFilterClick={onFilterClick} />
            <MapFilter loading={true} filter={Types.Private} icon={<PrivateIcon />} onFilterClick={onFilterClick} />
            <MapFilter loading={false} filter={Types.Shop} icon={<ShopIcon />} onFilterClick={onFilterClick} />
            <MapFilter loading={false} filter={Status.Wip} icon={<WipIcon />} onFilterClick={onFilterClick} />
            <MapFilter loading={false} filter={Status.Rip} icon={<RipIcon />} onFilterClick={onFilterClick} />
        </div>
    );
};

export default index;
