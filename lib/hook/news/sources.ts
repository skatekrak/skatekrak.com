import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Source } from 'rss-feed';

const fetchNewsSources = async () => {
    const { data } = await axios.get<Source[]>(`${process.env.NEXT_PUBLIC_RSS_BACKEND_URL}/sources`, {
        params: {
            types: ['rss'],
        },
    });
    return data;
};

const useNewsSources = () => {
    return useQuery({ queryKey: ['news-sources'], queryFn: fetchNewsSources, refetchOnWindowFocus: false });
};

export default useNewsSources;
