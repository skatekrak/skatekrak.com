import Feudartifice from '..';
import { useInfiniteQuery } from 'react-query';

import { Media } from '../types';

const { client } = Feudartifice;

const fetchMedias = async (spotId: string, cursor: any = new Date()) => {
    const { data } = await client.get<Media[]>(`/spots/${spotId}/medias`, {
        params: {
            older: cursor,
            limit: 50,
        },
    });

    return data;
};

const useSpotMedias = (spotId: string, initialMedias: Media[] = []) => {
    return useInfiniteQuery<Media[]>(['fetch-spot-medias', spotId], ({ pageParam }) => fetchMedias(spotId, pageParam), {
        getNextPageParam: (lastPage, pages) => {
            const lastElement = lastPage[lastPage.length - 1];
            if (lastElement != null) {
                return lastElement.createdAt;
            }
            return false;
        },
        // initialData: initialMedias,
        refetchOnWindowFocus: false,
    });
};

export default useSpotMedias;
