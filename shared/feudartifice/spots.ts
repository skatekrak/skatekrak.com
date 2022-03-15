import client from './client';
import { Types, Status, Cluster, Spot } from './types';

export type FiltersParams = {
    indoor?: boolean;
    type: Types[];
    status: Status[];
};

export type QuerySearchSpotsParams = {
    query?: string;
    filters?: FiltersParams;
};

export type BoxSearchSpotsParams = {
    northEastLatitude?: number;
    northEastLongitude?: number;
    southWestLatitude?: number;
    southWestLongitude?: number;
    filters?: FiltersParams;
};

export type BoxSearchSpotsParamsClustered = {
    clustering: true;
} & BoxSearchSpotsParams;

export type BoxSearchSpotsParamsNonClustered = {
    clustering: false;
    limit?: number;
} & BoxSearchSpotsParams;

export type BoxSearchType = BoxSearchSpotsParamsClustered | BoxSearchSpotsParamsNonClustered;
export type BoxSearchResult<T> = T extends BoxSearchSpotsParamsClustered
    ? Cluster[]
    : T extends BoxSearchSpotsParamsNonClustered
    ? Spot[]
    : never;

/**
 * Search and returns spots with given map bounds
 * @param params
 */
export async function boxSearchSpots<T extends BoxSearchType>(params: T): Promise<BoxSearchResult<T>> {
    if (params.clustering) {
        const res = await client.get<BoxSearchResult<T>>('/spots/search', { params });
        return res.data;
    }
    const res = await client.get<BoxSearchResult<T>>('/spots/search', { params });
    return res.data;
}
/**
 * Search and returns spots with query search (on name, description and address)
 * @param params
 */
export async function querySearchSpots(params: QuerySearchSpotsParams): Promise<Spot[]> {
    const res = await client.get<Spot[]>('/spots/search', { params });
    return res.data;
}

type AddSpotParam = {
    name: string;
    type: Types;
    latitude: number;
    longitude: number;
    indoor: boolean;
};

export async function addSpot(body: AddSpotParam) {
    const res = await client.post<Spot>('/spots', body);
    return res.data;
}
