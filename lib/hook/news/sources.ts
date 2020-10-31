import axios from 'axios';
import { useQuery } from 'react-query';
import { Source } from 'rss-feed';

const fetchNewsSources = async () => {
    const { data } = await axios.get<Source[]>(`${process.env.NEXT_PUBLIC_RSS_BACKEND_URL}/sources`);
    return data;
};

const useNewsSources = () => {
    return useQuery('news-sources', fetchNewsSources, {
        refetchOnWindowFocus: false,
    });
};

export default useNewsSources;
