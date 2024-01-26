import carrelage from 'lib/carrelageClient';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { Media } from 'lib/carrelageClient';
import { AxiosError } from 'axios';
import { sub } from 'date-fns';
import { first } from 'radash';

const fetchMedias = async (
    spotId: string,
    cursor: { date: Date; dir: 'next' | 'prev' } = { date: new Date(), dir: 'next' },
) => {
    let params: any = { older: cursor.date };
    if (cursor.dir === 'prev') {
        params = { newer: cursor.date };
    }
    const { data } = await carrelage.get<Media[]>(`/spots/${spotId}/medias`, {
        params: {
            ...params,
            limit: 20,
        },
    });

    return data;
};

export const useSpotMediasAround = (spotId: string, media: Media) => {
    return useQuery(['fetch-spots-medias-around', spotId, media.id], async () => {
        const [prevRes, nextRes] = await Promise.all([
            carrelage.get<Media[]>(`/spots/${spotId}/medias`, { params: { newer: media.createdAt, limit: 1 } }),
            carrelage.get<Media[]>(`/spots/${spotId}/medias`, { params: { older: media.createdAt, limit: 1 } }),
        ]);

        return { prevMedia: first(prevRes.data), nextMedia: first(nextRes.data) };
    });
};

const useSpotMedias = (spotId: string, initialMedias: Media[], key?: string) => {
    return useInfiniteQuery<Media[], AxiosError<any>>(
        ['fetch-spot-medias', spotId, key],
        ({ pageParam }) => fetchMedias(spotId, pageParam),
        {
            getNextPageParam: (lastPage) => {
                const lastElement = lastPage[lastPage.length - 1];
                if (lastElement != null) {
                    return { date: lastElement.createdAt, dir: 'next' };
                }
                return false;
            },
            getPreviousPageParam: (firstPage) => {
                const firstElement = firstPage[0];
                if (firstElement != null) {
                    return { date: firstElement.createdAt, dir: 'prev' };
                }
                return false;
            },
            initialData: {
                pages: [initialMedias],
                pageParams:
                    initialMedias.length >= 20
                        ? [{ date: sub(first(initialMedias)?.createdAt ?? new Date(), { seconds: 1 }), dir: 'next' }]
                        : [],
            },
            refetchOnWindowFocus: false,
        },
    );
};

export default useSpotMedias;
