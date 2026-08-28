import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { MapRef } from 'react-map-gl/maplibre';

import type { ContractInputs } from '@krak/contracts';
import { SpotGeoJSON } from '@krak/types';

import { useViewport } from '@/lib/hook/queryState';
import useDebounce from '@/lib/hook/useDebounce';
import { client } from '@/server/orpc/client';

export type MapBounds = ContractInputs['spots']['getSpotsGeoJSON'];

export const useSpotsGeoJSON = (mapRef: MapRef | undefined, enabled = true) => {
    const [viewport] = useViewport();
    const [resizeCount, setResizeCount] = useState(0);

    const debouncedViewport = useDebounce(viewport, 200);

    useEffect(() => {
        if (mapRef == null) return;

        const map = mapRef.getMap();
        const handleResize = () => setResizeCount((count) => count + 1);
        map.on('resize', handleResize);
        return () => {
            map.off('resize', handleResize);
        };
    }, [mapRef]);

    const bounds = useMemo<MapBounds | undefined>(() => {
        if (!enabled || mapRef == null) return undefined;

        const mapBounds = mapRef.getMap().getBounds();
        return {
            northEast: {
                latitude: mapBounds.getNorthEast().lat,
                longitude: mapBounds.getNorthEast().lng,
            },
            southWest: {
                latitude: mapBounds.getSouthWest().lat,
                longitude: mapBounds.getSouthWest().lng,
            },
        };
        // Recalculate bounds after the viewport settles.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedViewport, enabled, mapRef, resizeCount]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, ...queryRes } = useQuery({
        queryKey: ['fetch-spots-geojson', debouncedViewport, bounds],
        queryFn: async () => {
            if (bounds == null) return [];
            const spots = await client.spots.getSpotsGeoJSON(bounds);
            return spots as unknown as SpotGeoJSON[];
        },
        enabled: bounds != null,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        placeholderData: keepPreviousData,
    });

    return {
        data: data ?? [],
        bounds,
        ...queryRes,
    };
};
