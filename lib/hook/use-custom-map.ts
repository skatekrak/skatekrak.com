import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const useCustomMap = (id: string) => {
    return useQuery(['load-custom-map', id], async () => {
        if (id == null) {
            return null;
        }
        const response = await axios.get('/api/custom-maps', { params: { id: id } });
        const customMap = response.data;
        return customMap;
    });
};

export default useCustomMap;
