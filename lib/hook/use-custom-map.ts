import { useQuery } from 'react-query';
import axios from 'axios';

const useCustomMap = (id: string) => {
    return useQuery(['load-custom-map', id], async () => {
        if (id == null) {
            return null;
        }
        const response = await axios.get('/api/custom-maps', { params: { id: id } });
        const customMap = response.data;
        return {
            ...customMap,
            clusters: customMap.spots.map((spot) => ({
                id: spot.id,
                latitude: spot.location.latitude,
                longitude: spot.location.longitude,
                count: 1,
                spots: [spot],
            })),
        };
    });
};

export default useCustomMap;
