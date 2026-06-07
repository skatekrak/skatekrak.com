import { Meilisearch } from 'meilisearch';

import type { Map } from '@krak/prisma';

import { env } from '../env';

const client = new Meilisearch({
    host: env.MEILI_HOST,
    apiKey: env.MEILI_ADMIN_KEY,
});

export const mapIndex = client.index('prod_MAPS');

/**
 * Builds the Meilisearch document for a Map. Must stay in sync with the
 * incremental indexing done in the API's admin router.
 */
export function buildMapDocument(map: Map) {
    return {
        id: map.id,
        name: map.name,
        subtitle: map.subtitle,
        edito: map.edito,
        about: map.about,
        categories: map.categories,
        staging: map.staging,
        videos: map.videos,
        soundtrack: map.soundtrack,
    };
}

export default client;
