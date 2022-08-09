import axios from 'axios';
import { removeEmptyStringAndNull } from 'lib/helpers';

import Content from 'models/Content';
import { useInfiniteQuery } from '@tanstack/react-query';
import { IContent, Pagination } from 'rss-feed';

export type FetchNewsParams = {
    sources: number[];
};

const fetchContents = async (params: FetchNewsParams, page: any = 1): Promise<Content[]> => {
    const { data } = await axios.get<Pagination<IContent>>(`${process.env.NEXT_PUBLIC_RSS_BACKEND_URL}/contents`, {
        params: {
            sourceTypes: ['rss'],
            ...removeEmptyStringAndNull(params),
            page,
        },
    });

    return data.items.map((content) => new Content(content));
};

const useNewsContent = (params: FetchNewsParams) => {
    return useInfiniteQuery(['news-feed', params], ({ pageParam }) => fetchContents(params, pageParam), {
        getNextPageParam: (lastPages, allPages) => {
            if (lastPages.length < 20) {
                return false;
            }
            return allPages.length + 1;
        },
        refetchOnWindowFocus: false,
    });
};

export default useNewsContent;
