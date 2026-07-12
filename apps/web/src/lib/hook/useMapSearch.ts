import { useQuery } from '@tanstack/react-query';

import meilisearchClient, { SPOT_INDEX_UID, MAP_INDEX_UID, type SpotHit, type MapHit } from '@/lib/meilisearch';

import useDebounce from './useDebounce';

export type SearchResultItem = { kind: 'spot'; data: SpotHit } | { kind: 'map'; data: MapHit };

export function useCombinedSearch(query: string, hitsPerPage = 10) {
    const debouncedQuery = useDebounce(query, 200);

    const searchQuery = useQuery({
        queryKey: ['search-combined', debouncedQuery, hitsPerPage],
        queryFn: async () => {
            const response = await meilisearchClient.multiSearch({
                federation: { limit: hitsPerPage },
                queries: [
                    {
                        indexUid: SPOT_INDEX_UID,
                        q: debouncedQuery,
                    },
                    {
                        indexUid: MAP_INDEX_UID,
                        q: debouncedQuery,
                    },
                ],
            });

            return response.hits.map(
                (hit): SearchResultItem =>
                    hit['_federation']?.indexUid === SPOT_INDEX_UID
                        ? { kind: 'spot', data: hit as SpotHit }
                        : { kind: 'map', data: hit as MapHit },
            );
        },
        enabled: debouncedQuery.length > 0,
    });

    return {
        results: searchQuery.data ?? [],
        isLoading: searchQuery.isLoading,
    };
}
