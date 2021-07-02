import axios from 'axios';
import { useInfiniteQuery } from 'react-query';
import { Video } from 'rss-feed';

export type FetchVideoParams = {
    filters: string[];
    query?: string;
};

const fetchVideos = async (params: FetchVideoParams, page: unknown = 1) => {
    let data: Video[] = [];
    if (params.query) {
        const res = await axios.get<Video[]>(`${process.env.NEXT_PUBLIC_RSS_BACKEND_URL}/videos/search`, {
            params: {
                ...params,
                page,
            },
        });
        data = res.data;
    }

    const res = await axios.get<Video[]>(`${process.env.NEXT_PUBLIC_RSS_BACKEND_URL}/videos/`, {
        params: {
            ...params,
            page,
        },
    });
    data = res.data;

    return data;
};

const useVideos = (params: FetchVideoParams) => {
    return useInfiniteQuery(['videos-feed', params], ({ pageParam }) => fetchVideos(params, pageParam), {
        getNextPageParam: (lastPages, allPages) => {
            if (lastPages.length < 20) {
                return false;
            }
            return allPages.length + 1;
        },
    });
};

export default useVideos;
