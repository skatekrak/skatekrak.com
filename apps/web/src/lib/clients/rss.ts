import axios from 'axios';

const rssClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_RSS_BACKEND_URL,
});

export default rssClient;
