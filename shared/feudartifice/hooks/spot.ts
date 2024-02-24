import Feudartifice from '..';
import type { Spot } from '../types';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { MapRef } from 'react-map-gl';
import { MutableRefObject, useEffect, useState } from 'react';
import useDebounce from 'lib/hook/useDebounce';
import { useAppDispatch, useAppSelector } from 'store/hook';
import { mapRefreshEnd } from 'store/map/slice';
import { boxSpotsSearch, getSpotsByTags, spotsSearchGeoJSON } from 'lib/carrelageClient';
import { sort, unique } from 'radash';

const { client } = Feudartifice;

export const fetchSpot = async (id: string): Promise<Spot> => {
    const res = await client.get<Spot>(`/spots/${id}`);
    return res.data;
};

const useSpot = (id: string) => {
    return useQuery({ queryKey: ['fetch-spot', id], queryFn: () => fetchSpot(id), placeholderData: keepPreviousData });
};

export const useSpotsSearch = (mapRef: MutableRefObject<MapRef>, enabled = true) => {
    const viewport = useAppSelector((state) => state.map.viewport);
    const dispatch = useAppDispatch();

    const debouncedViewport = useDebounce(viewport, 200);
    const [loadedSpots, setLoadedSpots] = useState<Spot[]>([]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, ...queryRes } = useQuery({
        queryKey: ['fetch-spots-on-map', debouncedViewport],
        queryFn: async () => {
            const map = mapRef.current.getMap();
            const bounds = map.getBounds();
            console.log(bounds);
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

        enabled,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        placeholderData: keepPreviousData,
    });

    useEffect(() => {
        if (data != null) {
            dispatch(mapRefreshEnd());
            setLoadedSpots((previousSpots) => unique(previousSpots.concat(data ?? []), (a) => a.id));
        }
    }, [data, dispatch, setLoadedSpots]);

    return {
        data: loadedSpots,
        ...queryRes,
    };
};

export const useSpotsByTags = (tags: string[] | undefined, tagsFromMedia?: boolean) => {
    return useQuery({
        queryKey: ['fetch-spots-by-tags', tags, tagsFromMedia],
        queryFn: async () => {
            if (tags != null && tagsFromMedia != null) {
                const spots = await getSpotsByTags(tags, tagsFromMedia);
                return sort(spots, (s) => s.mediasStat.all, true);
            }
            return;
        },
        enabled: !!tags && tagsFromMedia != null,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
    });
};

export const useSpotsGeoJSON = (mapRef: MutableRefObject<MapRef>, enabled = true) => {
    const viewport = useAppSelector((state) => state.map.viewport);
    const dispatch = useAppDispatch();

    const debouncedViewport = useDebounce(viewport, 200);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, ...queryRes } = useQuery({
        queryKey: ['fetch-spots-geojson', debouncedViewport],
        queryFn: async () => {
            const map = mapRef.current.getMap();
            const bounds = map.getBounds();
            const northEast = bounds.getNorthEast();
            const southWest = bounds.getSouthWest();

            const spots = await spotsSearchGeoJSON({
                northEastLatitude: northEast.lat,
                northEastLongitude: northEast.lng,
                southWestLatitude: southWest.lat,
                southWestLongitude: southWest.lng,
            });

            console.log('SPOTS', spots.length);

            return spots;
        },
        enabled,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        placeholderData: keepPreviousData,
    });

    useEffect(() => {
        if (queryRes.isLoading) {
            dispatch(mapRefreshEnd());
        }
    }, [queryRes.isLoading, dispatch]);

    return {
        data: data ?? [],
        ...queryRes,
    };
};

export default useSpot;
