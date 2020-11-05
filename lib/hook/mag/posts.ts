import krakmag from 'lib/clients/krakmag';
import { formatPost } from 'lib/mag/formattedPost';
import { useInfiniteQuery } from 'react-query';
import queryString from 'query-string';
import { Post } from 'wordpress-types';

export type PostsFetchParam = {
    per_page: number;
    categories: string[];
    search?: string;
};

const fetchPosts = async (key: string, page: any = 1) => {
    const { data } = await krakmag.get<Post[]>(`/wp-json/wp/v2/posts`, {
        params: {
            ...queryString.parse(key),
            page,
            _embed: 1,
        },
    });

    const posts = data.map((post) => formatPost(post));
    return posts;
};

const usePosts = (params: PostsFetchParam) => {
    return useInfiniteQuery(queryString.stringify({ ...params, key: 'mag-feed' }), fetchPosts, {
        getFetchMore: (lastPages, allPages) => {
            if (lastPages.length < params.per_page) {
                return false;
            }
            return allPages.length + 1;
        },
        refetchOnWindowFocus: false,
    });
};

export default usePosts;
