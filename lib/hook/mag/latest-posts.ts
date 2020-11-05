import { useQuery } from 'react-query';

import { Post } from 'wordpress-types';

import krakmag from 'lib/clients/krakmag';
import { formatPost } from 'lib/mag/formattedPost';

const fetchLatestPosts = async () => {
    const { data } = await krakmag.get<Post[]>('/wp-json/wp/v2/posts', {
        params: {
            per_page: 3,
            _embed: 1,
        },
    });
    return data.map((post) => formatPost(post));
};

const useLatestPosts = () => {
    return useQuery('mag-latest-posts', fetchLatestPosts);
};

export default useLatestPosts;
