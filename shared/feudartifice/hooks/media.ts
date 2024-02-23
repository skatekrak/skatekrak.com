import carrelage from 'lib/carrelageClient';
import Feudartifice from '..';
import type { Media } from '../types';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { first } from 'radash';

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

export const useHashtagMediasAround = (hashtag: string, media: Media) => {
    return useQuery(['fetch-hashtag-medias-around', hashtag, media.id], async () => {
        const [prevRes, nextRes] = await Promise.all([
            carrelage.get<Media[]>(`/medias`, { params: { hashtag, newer: media.createdAt, limit: 1 } }),
            carrelage.get<Media[]>(`/medias`, { params: { hashtag, older: media.createdAt, limit: 1 } }),
        ]);

        return { prevMedia: first(prevRes.data), nextMedia: first(nextRes.data) };
    });
};

export default useMedia;
