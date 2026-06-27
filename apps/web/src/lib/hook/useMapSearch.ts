import { useQuery } from '@tanstack/react-query';

import {
    spotIndex,
    mapIndex,
    type SpotSearchResult,
    type MapSearchResult,
    type SpotHit,
    type MapHit,
} from '@/lib/meilisearch';

import useDebounce from './useDebounce';

export type SearchResultItem = { kind: 'spot'; data: SpotHit } | { kind: 'map'; data: MapHit };

export function useCombinedSearch(query: string, hitsPerPage = 10) {
    const debouncedQuery = useDebounce(query, 200);

    const spotQuery = useQuery({
        queryKey: ['search-spots', debouncedQuery],
        queryFn: () =>
            spotIndex.search<SpotSearchResult>(debouncedQuery, {
                hitsPerPage,
                showRankingScore: true,
            }),
        enabled: debouncedQuery.length > 0,
    });

    const mapQuery = useQuery({
        queryKey: ['search-maps', debouncedQuery],
        queryFn: () =>
            mapIndex.search<MapSearchResult>(debouncedQuery, {
                hitsPerPage,
                showRankingScore: true,
            }),
        enabled: debouncedQuery.length > 0,
    });

    const results: SearchResultItem[] = [
        ...(spotQuery.data?.hits ?? []).map((spot) => ({ kind: 'spot' as const, data: spot })),
        ...(mapQuery.data?.hits ?? []).map((map) => ({ kind: 'map' as const, data: map })),
    ].toSorted((a, b) => (b.data._rankingScore ?? 0) - (a.data._rankingScore ?? 0));

    return {
        results,
        isLoading: spotQuery.isLoading || mapQuery.isLoading,
    };
}
