import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import type { QuickAccessMap } from 'components/pages/map/mapQuickAccess/MapQuickAccessDesktop/MapQuickAccessDesktop';
import { toggleLegend, toggleSearchResult } from 'store/map/slice';
import { updateUrlParams } from 'store/map/slice';
import MapQuickAccessDesktopItem from '../MapQuickAccessDesktopItem';

type Props = {
    map: QuickAccessMap;
};

const MapQuickAccessDesktopCustom = ({ map }: Props) => {
    const router = useRouter();
    const dispatch = useDispatch();

    const isMapSelected = useMemo(() => {
        return router.query.id === map.id;
    }, [router.query.id, map.id]);

    const isNoMapSelected = useMemo(() => {
        return router.query.id !== undefined && router.query.id !== map.id;
    }, [router.query.id, map.id]);

    const onClick = (e: React.SyntheticEvent) => {
        e.preventDefault();
        dispatch(toggleLegend(false));
        dispatch(toggleSearchResult(false));
        dispatch(
            updateUrlParams({
                spotId: null,
                modal: false,
                customMapId: map.id,
            }),
        );
    };

    return (
        <MapQuickAccessDesktopItem
            selected={isMapSelected}
            noMapSelected={isNoMapSelected}
            onClick={onClick}
            data={map}
        />
    );
};

export default MapQuickAccessDesktopCustom;
