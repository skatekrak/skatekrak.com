import { useQuery } from '@tanstack/react-query';

import { fetchJson } from '@/lib/fetchJson';

import { Place } from '../google';

export const fetchPlaces = async (query: string) => {
    if (query === '') {
        return [];
    }
    return fetchJson<Place[]>('https://skatekrak.com/api/place-search', { input: query });
};

const usePlaceSearch = (query: string) => {
    return useQuery({ queryKey: ['fetch-places', query], queryFn: () => fetchPlaces(query) });
};

export default usePlaceSearch;
