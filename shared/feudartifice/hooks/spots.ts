import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { boxSearchSpots, BoxSearchType } from '../spots';

const useSpots = <T extends BoxSearchType>(params: T) => {
    return useQuery({
        queryKey: ['box-search-spots', params],
        queryFn: () => {
            return boxSearchSpots(params);
        },
        enabled: params.northEastLatitude != null,
        placeholderData: keepPreviousData,
    });
};

export default useSpots;
