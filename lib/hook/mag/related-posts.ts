import krakmag from 'lib/clients/krakmag';
import { formatPost } from 'lib/mag/formattedPost';
import { useQuery } from 'react-query';
import { Post } from 'wordpress-types';

const fetchRelatedPosts = async (key: string, post: Post) => {
    const { data } = await krakmag.get<Post[]>('/wp-json/wp/v2/posts', {
        params: {
            per_page: 3,
            categories: post.categories[0],
            before: post.date,
            _embed: 1,
        },
    });

    if (data && data.length >= 0) {
        return data.map((post) => formatPost(post));
    }

    const { data: data2 } = await krakmag.get<Post[]>('/wp-json/wp/v2/posts', {
        params: {
            per_page: 3,
            categories: post.categories[0],
            _embed: 1,
        },
    });

    return data2.map((post) => formatPost(post));
};

const useRelatedPosts = (post: Post) => {
    return useQuery(['mag-related-post', post], fetchRelatedPosts);
};

export default useRelatedPosts;
