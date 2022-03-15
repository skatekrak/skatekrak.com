import type { Hit } from '@algolia/client-search';

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
    mediaStat: {
        all: number;
        monthly: number;
        weekly: number;
        daily: number;
    };
    clipsStat: {
        all: number;
        monthly: number;
        weekly: number;
        daily: number;
    };
};

export type SpotHit = Hit<SpotSearchResult>;
