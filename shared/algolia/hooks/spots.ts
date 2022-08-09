import type { SearchOptions } from '@algolia/client-search';
import type { RequestOptions } from '@algolia/transporter';
import { useQuery } from '@tanstack/react-query';

import type { SpotHit, SpotSearchResult } from '../algolia';
import { spotIndex } from '../client';

type AlgoliaQueryOptions = RequestOptions | SearchOptions;

/**
 * Fetch spots on Algolia
 * @param query
 * @param options
 */
export const fetchSpots = async (query: string, options?: AlgoliaQueryOptions): Promise<SpotHit[]> => {
    const res = await spotIndex.search<SpotSearchResult>(query, { hitsPerPage: 20, ...options });
    return res.hits;
};

/**
 * Hook to fetch spots on Algolia
 * @param query
 * @param options
 */
export const useAlgoliaSearchSpots = (query: string, options?: AlgoliaQueryOptions) => {
    const queryKey = ['algolia-spots-search', query, options];

    return useQuery<SpotHit[]>(
        queryKey,
        () => {
            return fetchSpots(query, options);
        },
        {
            keepPreviousData: true,
        },
    );
};
