import Feudartifice from '..';
import type { Spot } from '../types';
import { useQuery } from '@tanstack/react-query';
import { MapRef } from 'react-map-gl';
import { MutableRefObject, useState } from 'react';
import useDebounce from 'lib/hook/useDebounce';
import { useAppDispatch, useAppSelector } from 'store/hook';
import { getSelectedFilterState, mapRefreshEnd } from 'store/map/slice';
import { boxSpotsSearch } from 'lib/carrelageClient';
import { uniqWith } from 'lodash-es';

const { client } = Feudartifice;

export const fetchSpot = async (id: string): Promise<Spot> => {
    const res = await client.get<Spot>(`/spots/${id}`);
    return res.data;
};

const useSpot = (id: string) => {
    return useQuery(['fetch-spot', id], () => fetchSpot(id), { keepPreviousData: true });
};

export const useSpotsSearch = (mapRef: MutableRefObject<MapRef>, enabled = true) => {
    const status = useAppSelector((state) => state.map.status);
    const types = useAppSelector((state) => state.map.types);
    const viewport = useAppSelector((state) => state.map.viewport);
    const dispatch = useAppDispatch();

    const debouncedViewport = useDebounce(viewport, 200);
    const [loadedSpots, setLoadedSpots] = useState<Spot[]>([]);

    const { data, ...queryRes } = useQuery(
        ['fetch-spots-on-map', debouncedViewport, status, types],
        async () => {
            const map = mapRef.current.getMap();
            const bounds = map.getBounds();
            const northEast = bounds.getNorthEast();
            const southWest = bounds.getSouthWest();

            const spots = await boxSpotsSearch({
                northEastLatitude: northEast.lat,
                northEastLongitude: northEast.lng,
                southWestLatitude: southWest.lat,
                southWestLongitude: southWest.lng,
                filters: {
                    status: getSelectedFilterState(status),
                    type: getSelectedFilterState(types),
                },
                limit: 150,
            });

            return spots;
        },
        {
            enabled,
            onSettled: () => {
                dispatch(mapRefreshEnd());
                setLoadedSpots((previousSpots) => uniqWith(previousSpots.concat(data ?? []), (a, b) => a.id === b.id));
            },
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            keepPreviousData: true,
        },
    );

    return {
        data: loadedSpots,
        ...queryRes,
    };
};

export default useSpot;
