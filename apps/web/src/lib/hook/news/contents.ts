import { useInfiniteQuery } from '@tanstack/react-query';
import { IContent, Pagination } from 'rss-feed';

import { fetchJson } from '@/lib/fetchJson';
import { removeEmptyStringAndNull } from '@/lib/helpers';
import Content from '@/models/Content';

export type FetchNewsParams = {
    sources: string[];
};

const fetchContents = async (params: FetchNewsParams, page: number): Promise<Content[]> => {
    const data = await fetchJson<Pagination<IContent>>(`${process.env.NEXT_PUBLIC_RSS_BACKEND_URL}/contents`, {
        sourceTypes: ['rss'],
        ...removeEmptyStringAndNull(params),
        page,
    });

    return data.items.map((content) => new Content(content));
};

const useNewsContent = (params: FetchNewsParams) => {
    return useInfiniteQuery({
        queryKey: ['news-feed', params],
        queryFn: ({ pageParam }) => fetchContents(params, pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPages, allPages) => {
            if (lastPages.length < 20) {
                return null;
            }
            return allPages.length + 1;
        },
        refetchOnWindowFocus: false,
    });
};

export default useNewsContent;
