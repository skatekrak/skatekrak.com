import axios from 'axios';
import { useQuery } from 'react-query';
import { Source } from 'rss-feed';

const extractSourcesFromData = (data: any[]): Source[] => {
    const sources = [];
    data.forEach((item) => {
        if (item.slug !== 'uncategorized') {
            sources.push({
                id: item.id,
                title: item.name,
                label: item.name,
            });
        }
    });
    return sources;
};

const fetchCategories = async () => {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_KRAKMAG_URL}/wp-json/wp/v2/categories`, {
        params: {
            per_page: 20,
        },
    });
    return extractSourcesFromData(data);
};

const useMagCategories = () => {
    return useQuery('wp-categories', fetchCategories, {
        refetchOnWindowFocus: false,
    });
};

export default useMagCategories;
