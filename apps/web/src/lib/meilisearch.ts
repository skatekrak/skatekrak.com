import { Meilisearch, Hit } from 'meilisearch';

import { Types, Status } from '@krak/carrelage-client';

const client = new Meilisearch({
    host: process.env.NEXT_PUBLIC_MEILI_HOST!,
    apiKey: process.env.NEXT_PUBLIC_MEILI_API_KEY!,
});

export type SpotSearchResult = {
    objectID: string;
    name: string;
    coverURL: string;
    type: Types;
    status: Status;
    indoor: boolean;
    tags: string[];
    obstacles: string[];
    facebook?: string;
    instagram?: string;
    snapchat?: string;
    website?: string;
    location: {
        streetName: string;
        streetNumber: string;
        city: string;
        country: string;
    };
    _geo: {
        lat: number;
        lng: number;
    };
};

export type SpotHit = Hit<SpotSearchResult>;

export const spotIndex = client.index('prod_SPOTS');

export default client;
