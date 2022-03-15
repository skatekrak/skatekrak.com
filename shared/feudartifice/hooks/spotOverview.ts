import Feudartifice from '@shared/feudartifice';
import type { SpotOverview } from '@shared/feudartifice/types';
import { useQuery } from 'react-query';

const { client } = Feudartifice;

const fetchSpotOverview = async (id: string): Promise<SpotOverview> => {
    const res = await client.get<SpotOverview>(`/spots/${id}/overview`);
    return res.data;
};

const useSpotOverview = (id?: string) => {
    return useQuery(['fetch-spot-overview', id], () => fetchSpotOverview(id!), {
        // keepPreviousData: true,
        enabled: id != null,
    });
};

export default useSpotOverview;
