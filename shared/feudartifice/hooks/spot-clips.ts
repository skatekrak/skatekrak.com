import Feudartifice from '..';
import { useInfiniteQuery } from '@tanstack/react-query';

import { Clip } from '../types';

const { client } = Feudartifice;

const fetchClips = async (spotId: string, cursor: any = new Date()) => {
    const { data } = await client.get<Clip[]>(`/spots/${spotId}/clips`, {
        params: {
            older: cursor,
            limit: 50,
        },
    });

    return data;
};

const useSpotClips = (spotId: string, initialClips: Clip[] = []) => {
    return useInfiniteQuery<Clip[]>(['fetch-spot-clips', spotId], ({ pageParam }) => fetchClips(spotId, pageParam), {
        getNextPageParam: (lastPage, pages) => {
            const lastElement = lastPage[lastPage.length - 1];
            if (lastElement != null) {
                return lastElement.createdAt;
            }
            return false;
        },
        refetchOnWindowFocus: false,
    });
};

export default useSpotClips;
