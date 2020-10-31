import axios from 'axios';
import queryString from 'query-string';
import { useInfiniteQuery } from 'react-query';
import { Video } from 'rss-feed';

const fetchVideos = async (key: string, page: unknown = 1) => {
    const params = queryString.parse(key, { arrayFormat: 'bracket' });
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

export type FetchVideoParams = {
    filters: string[];
    query?: string;
};

const useVideos = (params: FetchVideoParams) => {
    return useInfiniteQuery(
        queryString.stringify({ ...params, key: 'videos-feed' }, { arrayFormat: 'bracket' }),
        fetchVideos,
        {
            getFetchMore: (lastPages, allPages) => {
                if (lastPages.length < 20) {
                    return false;
                }
                return allPages.length + 1;
            },
        },
    );
};

export default useVideos;
