import Feudartifice from '..';
import type { Spot } from '../types';
import { useQuery } from '@tanstack/react-query';
import { MapRef } from 'react-map-gl';
import { MutableRefObject, useState } from 'react';
import useDebounce from 'lib/hook/useDebounce';
import { useAppDispatch, useAppSelector } from 'store/hook';
import { mapRefreshEnd } from 'store/map/slice';
import { boxSpotsSearch, getSpotsByTags } from 'lib/carrelageClient';
import { sort, unique } from 'radash';

const { client } = Feudartifice;

export const fetchSpot = async (id: string): Promise<Spot> => {
    const res = await client.get<Spot>(`/spots/${id}`);
    return res.data;
};

const useSpot = (id: string) => {
    return useQuery(['fetch-spot', id], () => fetchSpot(id), { keepPreviousData: true });
};

export const useSpotsSearch = (mapRef: MutableRefObject<MapRef>, enabled = true) => {
    const viewport = useAppSelector((state) => state.map.viewport);
    const dispatch = useAppDispatch();

    const debouncedViewport = useDebounce(viewport, 200);
    const [loadedSpots, setLoadedSpots] = useState<Spot[]>([]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, ...queryRes } = useQuery(
        ['fetch-spots-on-map', debouncedViewport],
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
                limit: 150,
            });

            return spots;
        },
        {
            enabled,
            onSettled: () => {
                dispatch(mapRefreshEnd());
            },
            onSuccess: (newSpots) => {
                setLoadedSpots((previousSpots) => unique(previousSpots.concat(newSpots ?? []), (a) => a.id));
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

export const useSpotsByTags = (tags: string[] | undefined, tagsFromMedia?: boolean) => {
    return useQuery(
        ['fetch-spots-by-tags', tags, tagsFromMedia],
        async () => {
            if (tags != null && tagsFromMedia != null) {
                const spots = await getSpotsByTags(tags, tagsFromMedia);
                return sort(spots, (s) => s.mediasStat.all, true);
            }
            return;
        },
        {
            enabled: !!tags && !!tagsFromMedia,
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
        },
    );
};

export default useSpot;
