import Feudartifice from '@shared/feudartifice';
import queryString from 'query-string';
import { useInfiniteQuery } from 'react-query';

import { Media } from '../types';

const { client } = Feudartifice;

const fetchMedias = async (key: string, cursor: any = new Date()) => {
    const params = queryString.parse('?' + key);
    const { data } = await client.get<Media[]>(`/spots/${params.spotId}/medias`, {
        params: {
            older: cursor,
            limit: 50,
        },
    });

    return data;
};

const useSpotMedias = (spotId: string, initialMedias: Media[] = []) => {
    return useInfiniteQuery<Media[]>(
        queryString.stringify({ spotId, key: 'fetch-spot-medias' }),
        ({ queryKey, pageParam }) => fetchMedias(queryKey, pageParam),
        {
            getNextPageParam: (lastPage, pages) => {
                const lastElement = lastPage[lastPage.length - 1];
                if (lastElement != null) {
                    return lastElement.createdAt;
                }
                return false;
            },
            // initialData: initialMedias,
            refetchOnWindowFocus: false,
        },
    );
};

export default useSpotMedias;
