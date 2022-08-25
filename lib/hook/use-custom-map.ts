import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { QuickAccessMap } from 'components/pages/map/mapQuickAccess/MapQuickAccessDesktop/MapQuickAccessDesktop';

export const useCustomMaps = () => {
    return useQuery(['custom-maps'], () => axios.get<QuickAccessMap[]>('/api/custom-maps').then((res) => res.data), {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });
};

const useCustomMap = (id: string) => {
    return useQuery(
        ['load-custom-map', id],
        async () => {
            if (id == null) {
                return null;
            }
            const response = await axios.get('/api/custom-maps', { params: { id: id } });
            const customMap = response.data;
            return customMap;
        },
        {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
        },
    );
};

export default useCustomMap;
