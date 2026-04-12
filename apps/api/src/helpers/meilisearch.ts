import { Meilisearch } from 'meilisearch';

import { env } from '../env';

const client = new Meilisearch({
    host: env.MEILI_HOST,
    apiKey: env.MEILI_ADMIN_KEY,
});

export const spotIndex = client.index('prod_SPOTS');

export default client;
