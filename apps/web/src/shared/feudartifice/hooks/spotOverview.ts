import Feudartifice from '..';
import type { SpotOverview } from '../types';
import { useQuery } from '@tanstack/react-query';

const { client } = Feudartifice;

export const fetchSpotOverview = async (id: string): Promise<SpotOverview> => {
    const res = await client.get<SpotOverview>(`/spots/${id}/overview`);
    return res.data;
};

const useSpotOverview = (id?: string) => {
    return useQuery({
        queryKey: ['fetch-spot-overview', id],
        queryFn: () => fetchSpotOverview(id!),
        enabled: id != null,
    });
};

export default useSpotOverview;
