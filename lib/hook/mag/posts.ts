import axios from 'axios';
import { formatPost } from 'lib/mag/formattedPost';
import { useCallback } from 'react';
import { useInfiniteQuery } from 'react-query';

export interface Post {
    id?: number;
    title?: { rendered?: string };
    slug?: string;
    link?: string;
    date?: string;
    date_gmt?: string;
    modified_gmt?: string;
    content?: { rendered?: string };
    excerpt?: { rendered?: string };
    featured_media?: number;
    thumbnailImage?: string;
    featuredImageFull?: string;
    _format_video_embed?: string;
    categories?: any[];
    categoriesString?: string;
    _embedded?: Record<string, any>;
}

export type PostsFetchParam = {
    per_page: number;
    categories: string[];
    search?: string;
};

const usePosts = (params: PostsFetchParam) => {
    const fetchPosts = useCallback(
        async (key: string, page = 1) => {
            const { data } = await axios.get<Post[]>(`${process.env.NEXT_PUBLIC_KRAKMAG_URL}/wp-json/wp/v2/posts`, {
                params: {
                    ...params,
                    page,
                    _embed: 1,
                },
            });

            const posts = data.map((post) => formatPost(post));
            return posts;
        },
        [params],
    );

    return useInfiniteQuery('wp-posts', fetchPosts, {
        getFetchMore: (lastPages, allPages) => {
            if (lastPages.length < params.per_page) {
                return null;
            }
            return allPages.length + 1;
        },
        refetchOnWindowFocus: false,
    });
};

export default usePosts;
