import Feudartifice from '..';
import type { Spot } from '../types';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { MapRef } from 'react-map-gl';
import { useEffect, useState } from 'react';
import useDebounce from '@/lib/hook/useDebounce';
import { useAppDispatch } from '@/store/hook';
import { SpotGeoJSON, boxSpotsSearch, getSpotsByTags } from '@krak/carrelage-client';
import { sort, unique } from 'radash';
import { trpc } from '@/server/trpc/utils';
import { useViewport } from '@/lib/hook/queryState';

const { client } = Feudartifice;

export const fetchSpot = async (id: string): Promise<Spot> => {
    const res = await client.get<Spot>(`/spots/${id}`);
    return res.data;
};

export const useSpotsSearch = (mapRef: MapRef | undefined, enabled = true) => {
    const [viewport] = useViewport();
    const dispatch = useAppDispatch();

    const debouncedViewport = useDebounce(viewport, 200);
    const [loadedSpots, setLoadedSpots] = useState<Spot[]>([]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, ...queryRes } = useQuery({
        queryKey: ['fetch-spots-on-map', debouncedViewport],
        queryFn: async () => {
            if (mapRef == null) return [];
            const map = mapRef.getMap();
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

export const useSpotsGeoJSON = (mapRef: MapRef | undefined, enabled = true) => {
    const [viewport] = useViewport();
    const utils = trpc.useUtils();

    const debouncedViewport = useDebounce(viewport, 200);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, ...queryRes } = useQuery({
        queryKey: ['fetch-spots-geojson', debouncedViewport],
        queryFn: async () => {
            if (mapRef == null) return [];
            const map = mapRef.getMap();
            const bounds = map.getBounds();
            const northEast = bounds.getNorthEast();
            const southWest = bounds.getSouthWest();
            const spots = await utils.spots.getSpotsGeoJSON.fetch({
                northEast: { latitude: northEast.lat, longitude: northEast.lng },
                southWest: { latitude: southWest.lat, longitude: southWest.lng },
            });
            return spots as unknown as SpotGeoJSON[];
        },
        enabled,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        placeholderData: keepPreviousData,
    });

    return {
        data: data ?? [],
        ...queryRes,
    };
};
