import { useQuery } from '@tanstack/react-query';

import type { Country } from '@krak/contracts';

import meilisearchClient, { SPOT_INDEX_UID, MAP_INDEX_UID, type SpotHit, type MapHit } from '@/lib/meilisearch';
import { orpc } from '@/server/orpc/client';

import useDebounce from './useDebounce';

export type SearchResultItem =
    | { kind: 'spot'; data: SpotHit }
    | { kind: 'map'; data: MapHit }
    | { kind: 'country'; data: Country };

export function useCombinedSearch(query: string, hitsPerPage = 20) {
    const debouncedQuery = useDebounce(query, 200);
    const countriesQuery = useQuery(orpc.countries.list.queryOptions({ enabled: debouncedQuery.trim().length > 0 }));

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

    const countries = countriesQuery.data ?? [];
    const countryResults: SearchResultItem[] = countries
        .filter((country) =>
            `${country.name} ${country.code}`.toLowerCase().includes(debouncedQuery.trim().toLowerCase()),
        )
        .map((country) => ({ kind: 'country', data: country }));
    const otherResults = (searchQuery.data ?? []).filter(
        (item) => item.kind !== 'map' || !countries.some((country) => country.id === item.data.id),
    );

    return {
        results:
            query === debouncedQuery && debouncedQuery.trim().length > 0
                ? [...countryResults, ...otherResults].slice(0, hitsPerPage)
                : [],
        isLoading: query !== debouncedQuery || searchQuery.isLoading || countriesQuery.isLoading,
    };
}
