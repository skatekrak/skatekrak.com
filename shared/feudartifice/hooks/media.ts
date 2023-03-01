import Feudartifice from '..';
import type { Media } from '../types';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';

const { client } = Feudartifice;

const fetchMedia = async (id: string): Promise<Media> => {
    const res = await client.get<Media>(`/medias/${id}`);
    return res.data;
};

const useMedia = (id: string) => {
    return useQuery(['fetch-media', id], () => fetchMedia(id), {
        keepPreviousData: true,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
    });
};

type BaseFetchMediasOptions = {
    /// Default to 20
    limit?: number;
    hashtag?: string;
    older?: Date;
};

type FetchMediaOptions = BaseFetchMediasOptions & ({ older?: Date } | { newer?: Date });

export const fetchMedias = async (options: FetchMediaOptions = {}) => {
    const res = await client.get<Media[]>('/medias', {
        params: options,
    });
    return res.data;
};

export const useMedias = (options: BaseFetchMediasOptions = {}) => {
    return useQuery(['fetch-medias', options], () => fetchMedias(options), {
        keepPreviousData: true,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
    });
};

export const useInfiniteMedias = (options: BaseFetchMediasOptions = {}) => {
    return useInfiniteQuery(['fetch-medias', options], ({ pageParam }) => fetchMedias({ ...options, ...pageParam }), {
        getNextPageParam: (lastPage) => {
            const lastElement = lastPage[lastPage.length - 1];
            if (lastElement != null) {
                return { older: lastElement.createdAt };
            }
            return false;
        },
        keepPreviousData: true,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
    });
};

export default useMedia;
