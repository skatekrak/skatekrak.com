import { intersects } from 'radash';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useAppSelector } from 'store/hook';

export type PostsFetchParam = {
    per_page: number;
    categories: string[];
};

const usePosts = (params: PostsFetchParam) => {
    const articles = useAppSelector((state) => state.mag.articles);

    return useInfiniteQuery({
        queryKey: ['mag-feed', params, articles],
        queryFn: ({ pageParam: page }) => {
            console.log('articles', articles.length, params, page);

            if (params.categories.length > 0) {
                return articles
                    .filter((article) => intersects(article.categories, params.categories))
                    .slice(params.per_page * page, params.per_page + params.per_page * page);
            }
            return articles.slice(params.per_page * page, params.per_page + params.per_page * page);
        },
        initialPageParam: 0,
        getNextPageParam: (lastPages, allPages) => {
            console.log(lastPages.length);
            if (lastPages.length < params.per_page) {
                return null;
            }
            return allPages.length + 1;
        },
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        enabled: articles.length > 0,
    });
};

export default usePosts;
