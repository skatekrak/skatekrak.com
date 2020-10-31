import axios from 'axios';
import queryString from 'query-string';

import Content from 'models/Content';
import { useInfiniteQuery } from 'react-query';

const fetchContents = async (key: string, page: any = 1): Promise<Content[]> => {
    console.log(queryString.parse(key, { arrayFormat: 'bracket' }));
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_RSS_BACKEND_URL}/contents`, {
        params: {
            ...queryString.parse(key, { arrayFormat: 'bracket' }),
            page,
        },
    });

    return data.map((content) => new Content(content));
};

export type FetchNewsParams = {
    filters: string[];
    query?: string;
};

const useNewsContent = (params: FetchNewsParams) => {
    return useInfiniteQuery(
        queryString.stringify({ ...params, key: 'news-feed' }, { arrayFormat: 'bracket' }),
        fetchContents,
        {
            getFetchMore: (lastPages, allPages) => {
                if (lastPages.length < 20) {
                    return false;
                }
                return allPages.length + 1;
            },
            refetchOnWindowFocus: false,
        },
    );
};

export default useNewsContent;
