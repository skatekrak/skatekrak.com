import rssClient from 'lib/clients/rss';
import { useQuery } from 'react-query';
import { Source } from 'rss-feed';

const fetchSources = async () => {
    const { data } = await rssClient.get<Source[]>('/sources', {
        params: {
            types: ['youtube', 'vimeo'],
        },
    });

    return data;
};

const useVideosSources = () => {
    return useQuery('fetch-videos-sources', fetchSources, {
        refetchOnWindowFocus: false,
    });
};

export default useVideosSources;
