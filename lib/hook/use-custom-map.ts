import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { QuickAccessMap } from 'components/pages/map/mapQuickAccess/types';
import { CustomMap } from 'lib/map/types';

export const useCustomMaps = () => {
    return useQuery({
        queryKey: ['custom-maps'],
        queryFn: () =>
            axios.get<QuickAccessMap[]>('/api/custom-maps').then((res) => {
                return res.data;
            }),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });
};

const useCustomMap = (id: string | undefined) => {
    return useQuery({
        queryKey: ['load-custom-map', id],
        queryFn: async () => {
            if (id == null) {
                return undefined;
            }
            const response = await axios.get<CustomMap>('/api/custom-maps', { params: { id: id } });
            const customMap = response.data;
            return customMap;
        },
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });
};

export default useCustomMap;
