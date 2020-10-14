import algoliasearch from 'algoliasearch/lite';
import { shuffle } from '@algolia/client-common';
import type { Hit, SearchOptions, SearchResponse } from '@algolia/client-search';
import type { RequestOptions } from '@algolia/transporter';

import { Types, Status } from 'lib/carrelageClient';

const client = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.NEXT_PUBLIC_ALGOLIA_API_KEY);

export function places<T>(appId: string = '', apiKey: string = '', options: any = {}) {
    const placesClient = algoliasearch(appId, apiKey, {
        hosts: [{ url: 'places-dsn.algolia.net' }].concat(
            shuffle([
                { url: 'places-1.algolia.net' },
                { url: 'places-2.algolia.net' },
                { url: 'places-3.algolia.net' },
            ]),
        ),
        ...options,
    });

    return (query: string, requestOptions?: RequestOptions & SearchOptions) => {
        return placesClient.transporter.read<SearchResponse<T>>(
            {
                method: 'POST',
                path: '1/places/query',
                data: {
                    query,
                },
                cacheable: true,
            },
            requestOptions,
        );
    };
}

export type SpotSearchResult = {
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
    _geoloc: {
        lat: number;
        lng: number;
    };
};

export type Place = {
    locale_names: Record<string, string[]>;
    city: Record<string, string[]>;
    county: Record<string, string[]>;
    country: Record<string, string[]>;
    administrative: string[];
    country_code: string;
    postcode: string[];
    population: number;
    _geoloc: {
        lat: number;
        lng: number;
    };
};

export type PlaceHit = Hit<Place>;

export type SpotHit = Hit<SpotSearchResult>;

export function searchPlaces(query: string, requestOptions?: RequestOptions & SearchOptions) {
    return places<Place>(process.env.NEXT_PUBLIC_PLACES_APP_ID, process.env.NEXT_PUBLIC_PLACES_API_KEY)(
        query,
        requestOptions,
    );
}
export const spotIndex = client.initIndex('prod_SPOTS');

export default client;
