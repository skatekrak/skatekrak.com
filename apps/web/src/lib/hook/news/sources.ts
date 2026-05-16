import { useQuery } from '@tanstack/react-query';
import { Source } from 'rss-feed';

import { fetchJson } from '@/lib/fetchJson';

const fetchNewsSources = async () => {
    const data = await fetchJson<Source[]>(`${process.env.NEXT_PUBLIC_RSS_BACKEND_URL}/sources`, {
        types: ['rss'],
    });
    return data;
};

const useNewsSources = () => {
    return useQuery({ queryKey: ['news-sources'], queryFn: fetchNewsSources, refetchOnWindowFocus: false });
};

export default useNewsSources;
