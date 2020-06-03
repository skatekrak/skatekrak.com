import axios from 'axios';
import { Status, Types, Cluster, Spot } from 'carrelage';

const carrelage = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_CARRELAGE_URL}`,
});

export type FiltersParams = {
    indoor?: boolean;
    types: Types[];
    status: Status[];
};

export type QuerySearchSpotsParam = {
    query?: string;
    filters?: FiltersParams;
};

export type BoxSearchSpotsParams = {
    clustering: boolean;
    northEastLatitude?: number;
    northEastLongitude?: number;
    southWestLatitude?: number;
    southWestLongitude?: number;
    filters?: FiltersParams;
};

export type SearchSpotsParams = QuerySearchSpotsParam & BoxSearchSpotsParams;

/**
 * Search and returns spots with given map bounds
 * @param params
 */
export const boxSpotsSearch = async (params: BoxSearchSpotsParams) => {
    const res = await carrelage.get<Cluster[]>('/spots/search', { params });
    return res.data;
};

/**
 * Search and returns spots with query search (on name, description and address)
 * @param params
 */
export const querySpotsSearch = async (params: QuerySearchSpotsParam) => {
    const res = await carrelage.get<Spot[]>('/spots/search', { params });
    return res.data;
};

export const searchSpots = (params: SearchSpotsParams) => {
    return carrelage.get('/spots/search', { params });
};

export default carrelage;
