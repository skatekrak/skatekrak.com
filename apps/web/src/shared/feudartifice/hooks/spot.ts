import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { MapRef } from 'react-map-gl';
import { SpotGeoJSON } from '@krak/carrelage-client';
import { trpc } from '@/server/trpc/utils';
import useDebounce from '@/lib/hook/useDebounce';
import { useViewport } from '@/lib/hook/queryState';

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
