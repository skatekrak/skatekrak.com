import { keepPreviousData, useQuery } from '@tanstack/react-query';

import type { SpotHit, SpotSearchResult } from '../algolia';
import { spotIndex } from '../client';
import { AlgoliaSearchOptions } from 'algoliasearch/lite';

// type AlgoliaQueryOptions = RequestOptions | SearchOptions;

/**
 * Fetch spots on Algolia
 * @param query
 * @param options
 */
export const fetchSpots = async (query: string, options?: AlgoliaSearchOptions): Promise<SpotHit[]> => {
    const res = await spotIndex.search<SpotSearchResult>(query, { hitsPerPage: 20, ...options });
    return res.hits;
};

/**
 * Hook to fetch spots on Algolia
 * @param query
 * @param options
 */
export const useAlgoliaSearchSpots = (query: string, options?: AlgoliaSearchOptions) => {
    const queryKey = ['algolia-spots-search', query, options];

    return useQuery<SpotHit[]>({
        queryKey,
        queryFn: () => {
            return fetchSpots(query, options);
        },
        placeholderData: keepPreviousData,
    });
};
