import { intersection } from 'lodash-es';
import { useInfiniteQuery } from 'react-query';
import { useAppSelector } from 'store/hook';

export type PostsFetchParam = {
    per_page: number;
    categories: string[];
};

const usePosts = (params: PostsFetchParam) => {
    const articles = useAppSelector((state) => state.mag.articles);

    return useInfiniteQuery(
        ['mag-feed', params, articles],
        ({ pageParam }) => {
            console.log('articles', articles.length, params, pageParam);
            const page = pageParam ?? 0;

            if (params.categories.length > 0) {
                return articles
                    .filter((article) => intersection(article.categories, params.categories).length > 0)
                    .slice(params.per_page * page, params.per_page + params.per_page * page);
            }
            return articles.slice(params.per_page * page, params.per_page + params.per_page * page);
        },
        {
            getNextPageParam: (lastPages, allPages) => {
                console.log(lastPages.length);
                if (lastPages.length < params.per_page) {
                    return false;
                }
                return allPages.length + 1;
            },
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
            enabled: articles.length > 0,
        },
    );
};

export default usePosts;
