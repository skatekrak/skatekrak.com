import axios from 'axios';

const krakmag = axios.create({
    baseURL: process.env.NEXT_PUBLIC_KRAKMAG_URL,
});

export default krakmag;
