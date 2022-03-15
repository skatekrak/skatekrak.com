import axios from 'axios';

import pkg from './package.json';

const client = axios.create({
    baseURL: 'https://api.dev.skatekrak.com',
    headers: {
        'User-Agent': `Feudartifice (${pkg.version})`,
    },
});

export default client;
