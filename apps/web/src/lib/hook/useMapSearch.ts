import { useQuery } from '@tanstack/react-query';

import meilisearchClient, { SPOT_INDEX_UID, MAP_INDEX_UID, type SpotHit, type MapHit } from '@/lib/meilisearch';

import useDebounce from './useDebounce';

import type { SearchResponse } from 'meilisearch';

export type SearchResultItem = { kind: 'spot'; data: SpotHit } | { kind: 'map'; data: MapHit };

type MultiSearchResult = {
    results: SearchResponse[];
};

export function useCombinedSearch(query: string, hitsPerPage = 10) {
    const debouncedQuery = useDebounce(query, 200);

    const searchQuery = useQuery({
        queryKey: ['search-combined', debouncedQuery, hitsPerPage],
        queryFn: async () => {
            const response = (await meilisearchClient.multiSearch({
                queries: [
                    {
                        indexUid: SPOT_INDEX_UID,
                        q: debouncedQuery,
                        hitsPerPage,
                        showRankingScore: true,
                    },
                    {
                        indexUid: MAP_INDEX_UID,
                        q: debouncedQuery,
                        hitsPerPage,
                        showRankingScore: true,
                    },
                ],
            })) as MultiSearchResult;

            const [spotsResult, mapsResult] = response.results;

            const results: SearchResultItem[] = [
                ...(spotsResult.hits as SpotHit[]).map((spot): SearchResultItem => ({ kind: 'spot', data: spot })),
                ...(mapsResult.hits as MapHit[]).map((map): SearchResultItem => ({ kind: 'map', data: map })),
            ];

            return results.toSorted((a, b) => (b.data._rankingScore ?? 0) - (a.data._rankingScore ?? 0));
        },
        enabled: debouncedQuery.length > 0,
    });

    return {
        results: searchQuery.data ?? [],
        isLoading: searchQuery.isLoading,
    };
}
