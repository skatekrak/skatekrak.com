import Feudartifice from '@shared/feudartifice';
import queryString from 'query-string';
import { useInfiniteQuery } from 'react-query';

import { Clip } from '../types';

const { client } = Feudartifice;

const fetchClips = async (key: string, cursor: any = new Date()) => {
    const params = queryString.parse('?' + key);
    const { data } = await client.get<Clip[]>(`/spots/${params.spotId}/clips`, {
        params: {
            older: cursor,
            limit: 50,
        },
    });

    return data;
};

const useSpotClips = (spotId: string, initialClips: Clip[] = []) => {
    return useInfiniteQuery<Clip[]>(
        queryString.stringify({ spotId, key: 'fetch-spot-clips' }),
        ({ queryKey, pageParam }) => fetchClips(queryKey, pageParam),
        {
            getNextPageParam: (lastPage, pages) => {
                const lastElement = lastPage[lastPage.length - 1];
                if (lastElement != null) {
                    return lastElement.createdAt;
                }
                return false;
            },
            refetchOnWindowFocus: false,
        },
    );
};

export default useSpotClips;
