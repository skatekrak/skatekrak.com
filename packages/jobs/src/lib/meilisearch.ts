import { Meilisearch } from 'meilisearch';

import type { Map, Spot } from '@krak/prisma';

import { env } from '../env';

const client = new Meilisearch({
    host: env.MEILI_HOST,
    apiKey: env.MEILI_ADMIN_KEY,
});

export const mapIndex = client.index('prod_MAPS');
export const spotIndex = client.index('prod_SPOTS');

export function buildSpotDocument(spot: Spot) {
    return {
        objectID: spot.id,
        name: spot.name,
        coverURL: spot.coverURL ?? '',
        type: spot.type.toLowerCase(),
        status: spot.status.toLowerCase(),
        indoor: spot.indoor,
        tags: spot.tags,
        obstacles: spot.obstacles,
        facebook: spot.facebook ?? undefined,
        instagram: spot.instagram ?? undefined,
        snapchat: spot.snapchat ?? undefined,
        website: spot.website ?? undefined,
        location: {
            streetName: spot.streetName ?? '',
            streetNumber: spot.streetNumber ?? '',
            city: spot.city ?? '',
            country: spot.country ?? '',
        },
        _geo: {
            lat: spot.latitude,
            lng: spot.longitude,
        },
    };
}

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
