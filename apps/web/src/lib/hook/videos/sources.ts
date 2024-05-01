import rssClient from '@/lib/clients/rss';
import { useQuery } from '@tanstack/react-query';
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
    return useQuery({
        queryKey: ['fetch-videos-sources'],
        queryFn: fetchSources,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    });
};

export default useVideosSources;
