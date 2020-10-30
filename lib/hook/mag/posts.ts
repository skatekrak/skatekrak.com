import axios from 'axios';
import { formatPost } from 'lib/mag/formattedPost';
import { useInfiniteQuery } from 'react-query';
import queryString from 'query-string';

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

const fetchPosts = async (key: string, page: any = 1) => {
    const { data } = await axios.get<Post[]>(`${process.env.NEXT_PUBLIC_KRAKMAG_URL}/wp-json/wp/v2/posts`, {
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
    return useInfiniteQuery(queryString.stringify(params), fetchPosts, {
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
