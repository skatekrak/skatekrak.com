import Feudartifice from '..';
import type { Media } from '../types';
import { useQuery } from 'react-query';

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

export default useMedia;
