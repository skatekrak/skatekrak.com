import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

import { Place } from '../google';

export const fetchPlaces = async (query: string) => {
    if (query === '') {
        return [];
    }
    const res = await axios.get<Place[]>('https://skatekrak.com/api/place-search', { params: { input: query } });
    return res.data;
};

const usePlaceSearch = (query: string) => {
    return useQuery({ queryKey: ['fetch-places', query], queryFn: () => fetchPlaces(query) });
};

export default usePlaceSearch;
