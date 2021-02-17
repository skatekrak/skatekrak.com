import axios from 'axios';
import { useQuery } from 'react-query';
import { Video } from 'rss-feed';

const fetchFeaturedVideos = async () => {
    const { data } = await axios.get<Video[]>(`${process.env.NEXT_PUBLIC_RSS_BACKEND_URL}/videos/featured`);
    return data;
};

const useFeaturedVideos = () => {
    return useQuery('featured-videos', fetchFeaturedVideos, {
        refetchOnWindowFocus: false,
    });
};

export default useFeaturedVideos;
