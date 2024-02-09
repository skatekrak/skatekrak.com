import carrelage, { Clip } from 'lib/carrelageClient';
import { useInfiniteQuery } from '@tanstack/react-query';

const fetchClips = async (spotId: string, cursor: Date) => {
    const { data } = await carrelage.get<Clip[]>(`/spots/${spotId}/clips`, {
        params: {
            older: cursor,
            limit: 20,
        },
    });

    return data;
};

const useSpotClips = (spotId: string, initialClips: Clip[]) => {
    return useInfiniteQuery({
        queryKey: ['fetch-spot-clips', spotId],
        queryFn: ({ pageParam }) => fetchClips(spotId, pageParam),
        getNextPageParam: (lastPage) => {
            const lastElement = lastPage[lastPage.length - 1];
            if (lastElement != null) {
                return lastElement.createdAt;
            }
            return null;
        },
        initialPageParam: new Date(),
        initialData: {
            pages: [initialClips],
            pageParams: initialClips.length >= 20 ? [initialClips[initialClips.length - 1].createdAt] : [],
        },
        refetchOnWindowFocus: false,
    });
};

export default useSpotClips;
