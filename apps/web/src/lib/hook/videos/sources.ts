import { useQuery } from '@tanstack/react-query';
import { Source } from 'rss-feed';

import { fetchJson } from '@/lib/fetchJson';

const fetchSources = async () => {
    const data = await fetchJson<Source[]>(`${process.env.NEXT_PUBLIC_RSS_BACKEND_URL}/sources`, {
        types: ['youtube', 'vimeo'],
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
