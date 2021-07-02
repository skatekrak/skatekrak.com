import { useQuery } from 'react-query';

import krakmag from 'lib/clients/krakmag';
import { formatPost } from 'lib/mag/formattedPost';

const fetchPost = async (slug: string) => {
    const { data } = await krakmag.get(`/wp-json/wp/v2/posts?slug=${slug}&_embed`);
    return formatPost(data);
};

const useMagPost = (slug: string) => {
    return useQuery(['mag-post', slug], () => fetchPost(slug), {
        refetchOnWindowFocus: false,
    });
};

export default useMagPost;
