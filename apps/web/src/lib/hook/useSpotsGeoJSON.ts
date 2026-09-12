import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { MapRef } from 'react-map-gl/maplibre';

import type { ContractInputs } from '@krak/contracts';
import { SpotGeoJSON } from '@krak/types';

import { useViewport } from '@/lib/hook/queryState';
import useDebounce from '@/lib/hook/useDebounce';
import { getVisibleMapBounds, type MapPadding } from '@/lib/map/helpers';
import { client } from '@/server/orpc/client';

export type MapBounds = ContractInputs['spots']['getSpotsGeoJSON'];

export const useSpotsGeoJSON = (mapRef: MapRef | undefined, enabled = true, padding: MapPadding = {}) => {
    const [viewport] = useViewport();
    const [resizeCount, setResizeCount] = useState(0);

    const debouncedViewport = useDebounce(viewport, 200);
    const left = padding.left ?? 0;
    const top = padding.top ?? 0;
    const right = padding.right ?? 0;
    const bottom = padding.bottom ?? 0;

    useEffect(() => {
        if (mapRef == null) return;

        const map = mapRef.getMap();
        const handleResize = () => setResizeCount((count) => count + 1);
        map.on('resize', handleResize);
        return () => {
            map.off('resize', handleResize);
        };
    }, [mapRef]);

    const canvasBounds = useMemo<MapBounds | undefined>(() => {
        if (!enabled || mapRef == null) return undefined;

        return getVisibleMapBounds(mapRef.getMap());
        // Recalculate bounds after the viewport settles.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedViewport, enabled, mapRef, resizeCount]);

    const bounds = useMemo<MapBounds | undefined>(() => {
        if (!enabled || mapRef == null) return undefined;

        return getVisibleMapBounds(mapRef.getMap(), { left, top, right, bottom });
        // Recalculate bounds after the viewport settles, and when panel padding changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedViewport, enabled, mapRef, resizeCount, left, top, right, bottom]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { data, ...queryRes } = useQuery({
        queryKey: ['fetch-spots-geojson', debouncedViewport, canvasBounds],
        queryFn: async () => {
            if (canvasBounds == null) return [];
            const spots = await client.spots.getSpotsGeoJSON(canvasBounds);
            return spots as unknown as SpotGeoJSON[];
        },
        enabled: canvasBounds != null,
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
