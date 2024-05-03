import carrelage from '@krak/carrelage-client';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { Media } from '@krak/carrelage-client';
import { first } from 'radash';

const fetchMedias = async (spotId: string, cursor: Date) => {
    const { data } = await carrelage.get<Media[]>(`/spots/${spotId}/medias`, {
        params: {
            older: cursor,
            limit: 20,
        },
    });

    return data;
};

export const useSpotMediasAround = (spotId: string, media: Media) => {
    return useQuery({
        queryKey: ['fetch-spots-medias-around', spotId, media.id],
        queryFn: async () => {
            const [prevRes, nextRes] = await Promise.all([
                carrelage.get<Media[]>(`/spots/${spotId}/medias`, { params: { newer: media.createdAt, limit: 1 } }),
                carrelage.get<Media[]>(`/spots/${spotId}/medias`, { params: { older: media.createdAt, limit: 1 } }),
            ]);

            return { prevMedia: first(prevRes.data), nextMedia: first(nextRes.data) };
        },
    });
};

const useSpotMedias = (spotId: string, initialMedias: Media[], key?: string) => {
    return useInfiniteQuery({
        queryKey: ['fetch-spot-medias', spotId, key],
        queryFn: ({ pageParam }) => fetchMedias(spotId, pageParam),
        initialPageParam: new Date(),
        getNextPageParam: (lastPage) => {
            if (lastPage.length < 20) {
                return null;
            }

            const lastElement = lastPage[lastPage.length - 1];
            if (lastElement != null) {
                return lastElement.createdAt;
            }
            return null;
        },
        initialData: {
            pages: [initialMedias],
            pageParams: initialMedias.length >= 20 ? [first(initialMedias)?.createdAt ?? new Date()] : [],
        },
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });
};

export default useSpotMedias;
