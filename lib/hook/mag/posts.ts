import krakmag from 'lib/clients/krakmag';
import { formatPost } from 'lib/mag/formattedPost';
import { useInfiniteQuery } from 'react-query';
import { Post } from 'wordpress-types';

export type PostsFetchParam = {
    per_page: number;
    categories: string[];
    search?: string;
};

// Disable the warning for any, so the infinitQuery is happy
/* eslint @typescript-eslint/no-explicit-any: "off" */
const fetchPosts = async (params: PostsFetchParam, page: any = 1) => {
    const { data } = await krakmag.get<Post[]>(`/wp-json/wp/v2/posts`, {
        params: {
            ...params,
            page,
            _embed: 1,
        },
    });

    const posts = data.map((post) => formatPost(post));
    return posts;
};

const usePosts = (params: PostsFetchParam) => {
    return useInfiniteQuery<Post[]>(['mag-feed', params], ({ pageParam }) => fetchPosts(params, pageParam), {
        getNextPageParam: (lastPages, allPages) => {
            if (lastPages.length < params.per_page) {
                return false;
            }
            return allPages.length + 1;
        },
        refetchOnWindowFocus: false,
    });
};

export default usePosts;
