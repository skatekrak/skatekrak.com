import carrelage, { Clip } from 'lib/carrelageClient';
import { useInfiniteQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

const fetchClips = async (spotId: string, cursor: any = new Date()) => {
    const { data } = await carrelage.get<Clip[]>(`/spots/${spotId}/clips`, {
        params: {
            older: cursor,
            limit: 20,
        },
    });

    return data;
};

const useSpotClips = (spotId: string, initialClips: Clip[]) => {
    return useInfiniteQuery<Clip[], AxiosError<any>>(
        ['fetch-spot-clips', spotId],
        ({ pageParam }) => fetchClips(spotId, pageParam),
        {
            getNextPageParam: (lastPage) => {
                const lastElement = lastPage[lastPage.length - 1];
                if (lastElement != null) {
                    return lastElement.createdAt;
                }
                return false;
            },
            initialData: {
                pages: [initialClips],
                pageParams: initialClips.length >= 20 ? [initialClips[initialClips.length - 1].createdAt] : [],
            },
            refetchOnWindowFocus: false,
        },
    );
};

export default useSpotClips;
