import axios from 'axios';
import { removeEmptyStringAndNull } from 'lib/helpers';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Pagination, IContent } from 'rss-feed';

export type FetchVideoParams = {
    sources: number[];
    query?: string;
};

const fetchVideos = async (params: FetchVideoParams, page: unknown = 1) => {
    let data: IContent[] = [];
    const res = await axios.get<Pagination<IContent>>(`${process.env.NEXT_PUBLIC_RSS_BACKEND_URL}/contents`, {
        params: {
            ...removeEmptyStringAndNull(params),
            sourceTypes: ['youtube', 'vimeo'],
            page,
        },
    });
    data = res.data.items;

    return data;
};

const useVideos = (params: FetchVideoParams) => {
    return useInfiniteQuery({
        queryKey: ['videos-feed', params],
        queryFn: ({ pageParam }) => fetchVideos(params, pageParam),
        getNextPageParam: (lastPages, allPages) => {
            if (lastPages.length < 20) {
                return false;
            }
            return allPages.length + 1;
        },
        initialPageParam: 0,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });
};

export default useVideos;
