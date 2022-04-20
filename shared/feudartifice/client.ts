import axios from 'axios';

import pkg from './package.json';

const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_CARRELAGE_URL,
    headers: {
        'User-Agent': `Feudartifice (${pkg.version})`,
    },
    withCredentials: true,
});

export default client;
