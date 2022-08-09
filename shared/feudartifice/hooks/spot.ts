import Feudartifice from '..';
import type { Spot } from '../types';
import { useQuery } from '@tanstack/react-query';

const { client } = Feudartifice;

export const fetchSpot = async (id: string): Promise<Spot> => {
    const res = await client.get<Spot>(`/spots/{id}`);
    return res.data;
};

const useSpot = (id: string) => {
    return useQuery(['fetch-spot', id], () => fetchSpot(id), { keepPreviousData: true });
};

export default useSpot;
